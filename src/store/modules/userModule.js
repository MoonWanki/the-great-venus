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
    },
    balance: 0,
};

const SET_BALANCE = 'user/SET_BALANCE';
const SET_USER_DATA = 'user/SET_USER_DATA';

export const loadUserData = web3Instance => dispatch => {
    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        web3Instance.eth.getBalance(coinbase, (err, balance) => {
            if(!err) {
                dispatch({
                    type: SET_BALANCE,
                    payload: balance
                });
            } else {
                console.log("getBalance failed")
            }
        })

        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.users(coinbase);
            }).then(data => {
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

export const createUser = (web3Instance, name) => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.createUser(name, { from: coinbase });
            }).then(data => {
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

export const clearStage = (web3Instance, stageNo) => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.setStageMain(stageNo, [1], { from: coinbase });
            }).then(data => {
                window.Materialize.toast(JSON.stringify(data));
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error("error in getCoinbase()");
        }
    });
}

export const upgradeEquip = (web3Instance, statueNo, equipType) => {
    
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
            equips: payload[7],
        }
       return {
           ...state,
           userData: data
       }
    },
    [SET_BALANCE]: (state, { payload }) => {
        const balance = payload.c[0]*(10**5) + payload.c[1]/(10**9);
        return {
            ...state,
            balance: balance
        }
    },
}, initialState);
