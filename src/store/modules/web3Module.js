import { createAction, handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    web3Instance: null,
    isloadingUserData: false,
    userData: {
        name: null,
        rank: null,
        gold: null,
        exp: null,
        level: null,
        numStatues: null
    }
};

const INITIALIZE_WEB3 = 'web3/INITIALIZE_WEB3';
const SET_LODING_USER_DATA = 'web3/SET_LODING_USER_DATA';
const SIGN_UP = 'web3/SIGN_UP';

export const initializeWeb3 = createAction(INITIALIZE_WEB3);

export const loadUserData = web3Instance => dispatch => {

    if (web3Instance) {
        return (dispatch) => {

            dispatch({ type: SET_LODING_USER_DATA, payload: true });

            const TGV = contract(abi);
            TGV.setProvider(web3Instance.currentProvider)
            var TGVInstance;
            web3Instance.eth.getCoinbase((err, coinbase) => {
                if (!err) {
                    TGV.deployed()
                    .then(instance => {
                        TGVInstance = instance;
                        return TGVInstance.getMyInfo();
                    }).then(data => {
                        
                    })
                } else console.log("error: getCoinbase()");
            })
        }
    } else {
      console.error('Web3 is not initialized.');
    }
}

export const signUp = (web3Instance, name) => dispatch => {

    if (web3Instance) {
        return (dispatch) => {

            dispatch({ type: SET_LODING_USER_DATA, payload: true });

            const TGV = contract(abi);
            TGV.setProvider(web3Instance.currentProvider)
            var TGVInstance;
            web3Instance.eth.getCoinbase((err, coinbase) => {
                if (!err) {
                    TGV.deployed()
                    .then(instance => {
                        TGVInstance = instance;
                        return TGVInstance.getMyInfo();
                    }).then(data => {
                        
                    })
                } else console.log("error: getCoinbase()");
            })
        }
    } else {
      console.error('Web3 is not initialized.');
    }
}

export default handleActions({
    [INITIALIZE_WEB3]: (state, { payload }) => {
        console.log("web3 initialized!");
        return {
            ...state,
            web3Instance: payload,
         };
    },
    [SET_LODING_USER_DATA]: (state, { payload }) => {
        return {
            ...state,
            isloadingUserData: payload,
        };
    },
    [SIGN_UP]: (state, { payload }) => {
        let web3Instance = state.web3Instance;
        let nextState = null;
        if(typeof web3Instance !== 'undefined') {
            const TGV = contract(abi);
            TGV.setProvider(web3Instance.currentProvider);
            var TGVInstance;
            web3Instance.eth.getAccounts((error, accounts) => {
                TGV.deployed().then((instance) => {
                    TGVInstance = instance;
                    console.log("TGV is instantiated");
                    return TGVInstance.createUser("Jack", {from: accounts[0]});
                }).then((result) => {
                    console.log("CreateUser: " + result);
                    return TGVInstance.getMyInfo();
                }).then((result) => {
                    console.log("GetMyInfo: " + result.name);
                    nextState = {...state, result};
                }).catch((err) => console.log(err));
            });
            if(nextState) {
                return nextState;
            }

        } else {
            console.error('Web3 is not initialized');
        }
    },
}, initialState);
