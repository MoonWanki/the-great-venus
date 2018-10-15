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
        equipList: null,
    },
    balance: 0,
};

const SET_BALANCE = 'user/SET_BALANCE';
const SET_USER_DATA = 'user/SET_USER_DATA';

export const loadUserData = web3Instance => dispatch => {
    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    const coinbase = web3Instance.eth.coinbase;
    web3Instance.eth.getBalance(coinbase, (err, balance) => {
        if(!err) {
            dispatch({
                type: SET_BALANCE,
                payload: balance
            });
        } else console.log(err);
    });

    // Get user data
    let TGVInstance, userData;
    TGV.deployed()
    .then(instance => {
        TGVInstance = instance;
        return TGVInstance.users(coinbase);
    }).then(data => {
        userData = {
            name: data[0],
            rank: data[1],
            gold: data[2],
            exp: data[3],
            level: data[4],
            lastStage: data[5],
            numStatue: data[6],
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
    }).catch(err => {
        console.error(err);
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
            console.error(err);
        }
    });
}



export const clearFirstStage = (web3Instance, name) => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    let TGVInstance;
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                TGVInstance = instance;
                return TGVInstance.createUser(name, { from: coinbase });
            }).then(()=> {
                return TGVInstance.setStageMain.call(1, [1], { from: coinbase });
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export const clearStage = (web3Instance, stageNo) => async dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.setStageMain.call(stageNo, [1], { from: coinbase });
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
    
}


export const buyEquip = (web3Instance, unit, part, type) => {
    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.addEquipInfo(unit, part, type, { from: coinbase });
            }).then(data => {
                console.log(data);
                window.Materialize.toast("장비를 장착했습니다!", 1500);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export const upgradeEquip = (web3Instance, unit, part) => {
    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.upgradeEquip(unit, part, { from: coinbase });
            }).then(data => {
                console.log(data);
                window.Materialize.toast("장비를 강화했습니다!", 1500);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error(err);
        }
    });
}

export default handleActions({

    [SET_USER_DATA]: (state, { payload }) => {
        return {
           ...state,
           userData: payload
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
