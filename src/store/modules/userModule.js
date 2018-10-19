import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');
const TGV = contract(abi);

const initialState = {
    isLoaded: false,
    userData: {
        name: null,
        rank: null,
        gold: null,
        exp: null,
        level: null,
        lastStage: null,
        numStatue: null,
        equipList: null,
    },
    balance: 0,
};

const SET_BALANCE = 'user/SET_BALANCE';
const SET_USER_DATA = 'user/SET_USER_DATA';
const SET_LOADED = 'user/SET_LOADED';

export const loadUserData = web3Instance => dispatch => {
    TGV.setProvider(web3Instance.currentProvider);
    const coinbase = web3Instance.eth.coinbase;
    // web3Instance.eth.getBalance(coinbase, (err, balance) => {
    //     if(!err) {
    //         dispatch({
    //             type: SET_BALANCE,
    //             payload: balance
    //         });
    //     } else console.log(err);
    // });

    // Get user data
    let TGVInstance, userData;
    TGV.deployed()
    .then(instance => {
        TGVInstance = instance;
        return TGVInstance.users(coinbase);
    }).then(data => {
        userData = {
            name: data[0],
            rank: data[1].c,
            gold: data[2].c,
            exp: data[3].c,
            level: data[4].c,
            lastStage: data[5].c,
            numStatue: data[6].c,
        }
        let promises = [];
        for(let i=0 ; i<data[6] ; i++) {
            promises.push(TGVInstance.equipList(coinbase, i));
        }
        return Promise.all(promises);
    }).then(data => {
        userData = {
            ...userData,
            equipList: data.map(unit=>{
                return {
                    hpEquipType: unit[0].c[0],
                    hpEquipLevel: unit[1].c[0],
                    atkEquipType: unit[2].c[0],
                    atkEquipLevel: unit[3].c[0],
                    defEquipType: unit[4].c[0],
                    defEquipLevel: unit[5].c[0],
                    crtEquipType: unit[6].c[0],
                    avdEquipType: unit[7].c[0],
                }
            }),
        };
        dispatch({
            type: SET_USER_DATA,
            payload: userData
        });
        dispatch({
            type: SET_LOADED,
            payload: true
        });
    }).catch(err => {
        dispatch({
            type: SET_LOADED,
            payload: false
        });
        console.error(err);
    });
}

export const createUser = (web3Instance, name) => dispatch => {

    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                console.warn(instance);
                return instance.createUser(name, { from: coinbase });
            }).then(res => {
                console.log(res);
                window.Materialize.toast('유저 정보를 초기화합니다.', 1500);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export const clearStage = (web3Instance, stageNo, units) => dispatch => {

    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.clearStage(stageNo, units, { from: coinbase });
            }).then(res => {
                console.log(res);
                window.Materialize.toast(`${stageNo} 스테이지에 입장합니다.`, 1500);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export const buyEquip = (web3Instance, unit, part, type) => dispatch => {
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.buyEquip(unit, part, type, { from: coinbase });
            }).then(res => {
                console.log(res);
                loadUserData(web3Instance);
                window.Materialize.toast("장비를 장착합니다.", 1500);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export const upgradeEquip = (web3Instance, unit, part) => dispatch => {
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.upgradeEquip(unit, part, { from: coinbase });
            }).then(res => {
                console.log(res);
                window.Materialize.toast("장비를 강화합니다.", 1500);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export default handleActions({
    [SET_LOADED]: (state, { payload }) => {
        return {
            ...state,
            isLoaded: payload
        };
    },
    [SET_USER_DATA]: (state, { payload }) => {
        return {
            ...state,
            userData: payload
        };
    },
    [SET_BALANCE]: (state, { payload }) => {
        const balance = payload.c[0]*(10**5) + payload.c[1]/(10**9);
        return {
            ...state,
            balance: balance
        };
    },
}, initialState);
