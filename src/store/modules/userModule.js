import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    userData: {
        name: null,
        rank: null,
        gold: null,
        exp: null,
        level: null,
        lastStage: null,
        numStatue: null,
        equips: null,
    }
};

const SET_USER_DATA = 'user/SET_USER_DATA';

export const loadUserData = web3Instance => dispatch => {
    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                console.log("start");
                return instance.getMyInfo(coinbase);
            }).then(data => {
                dispatch({
                    type: SET_USER_DATA,
                    payload: data
                });
                console.log(data);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error("error in getCoinbase()");
        }
    });
}

export const createUser = (web3Instance, name) => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.createUser(name, { from: coinbase });
            }).then(data => {
                console.log(data);
                dispatch({
                    type: SET_USER_DATA,
                    payload: data
                });
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error("error in getCoinbase()");
        }
    });
}

export default handleActions({

    [SET_USER_DATA]: (state, { payload }) => {
        const data = {
            name: payload[0],
            rank: payload[1],
            gold: payload[2],
            exp: payload[3],
            level: payload[4],
            lastStage: payload[5],
            numStatue: payload[6],
            // equips: payload[7],
        }
        console.log(payload);
       return {
           ...state,
           userData: data
       }
    },
}, initialState);
