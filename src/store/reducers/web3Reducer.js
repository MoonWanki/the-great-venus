import { createAction, handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json'

const contract = require('truffle-contract');

const initialState = {
    web3: null,
    userData: null,
};

const INITIALIZE_WEB3 = 'INITIALIZE_WEB3';
const LOGIN = 'LOGIN';

export const initializeWeb3 = createAction(INITIALIZE_WEB3);
export const login = createAction(LOGIN);

export default handleActions({
    [INITIALIZE_WEB3]: (state, { payload }) => {
        return { ...state, web3: payload };
    },
    [LOGIN]: (state, { payload }) => {
        let web3 = state.web3;
        let nextState = null;
        if(typeof web3 !== 'undefined') {
            const TGV = contract(abi);
            TGV.setProvider(web3.currentProvider);
            var TGVInstance;
            web3.eth.getAccounts((error, accounts) => {
                TGV.deployed().then((instance) => {
                    TGVInstance = instance;
                    console.log("TGV is instantiated");
                    return TGVInstance.createUser("test1", {from: accounts[0]});
                }).then((result) => {
                    console.log("Signed up");
                    return TGVInstance.getMyInfo();
                }).then((result) => {
                    console.log("My nickname is " + result.name);
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
