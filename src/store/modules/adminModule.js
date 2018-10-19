import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    // isLoaded: false,
    // statueInfoList: null,
    // mobInfoList: null,
    // stageInfoList: null,
    // requiredExpList: null,
};

// const SET_LOADED = 'admin/SET_LOADED';
// const SET_STATUE = 'admin/SET_STATUE';
// const SET_MOB = 'admin/SET_MOB';
// const SET_STAGE = 'admin/SET_STAGE';
// const SET_REQUIRED_EXP = 'admin/SET_REQUIRED_EXP';

export const setConfigToDefault = web3Instance => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.setToDefault({ from: coinbase });
            }).then(() => {
                window.Materialize.toast('사전 설정이 완료되었습니다.', 2500);  
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error("error in getCoinbase()");
        }
    });
}

export const addConfig = (web3Instance, category, data) => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                switch(category) {
                    case 'statue':
                        return instance.addStatueInfo(data.hp, data.atk, data.def, data.crt, data.avd, { from: coinbase });
                    case 'mob':
                        return instance.addMobInfo(data.hp, data.atk, data.def, data.crt, data.avd, { from: coinbase });
                    case 'stage':
                        return instance.addStageInfo({ from: coinbase });
                    default:
                        throw Error("invalid category for running addConfig()");
                }
            }).then(() => {
                console.log(dispatch);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error("error in getCoinbase()");
        }
    });
}

export const editConfig = (web3Instance, category, data) => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                switch(category) {
                    case 'statue':
                        return instance.editStatueInfo(data.whatNo, data.hp, data.atk, data.def, data.crt, data.avd, { from: coinbase });
                    case 'mob':
                        return instance.editMobInfo(data.whatNo, data.hp, data.atk, data.def, data.crt, data.avd, { from: coinbase });
                    // case 'stage':
                    //     return instance.editStageInfo({ from: coinbase });
                    default:
                        throw Error("invalid category for running addConfig()");
                }
            }).then(() => {
                console.log(dispatch);
            }).catch(err => {
                console.error(err);
            })
        } else {
            console.error("error in getCoinbase()");
        }
    });
}

export default handleActions({
    // [SET_LOADED]: (state, { payload }) => {
    //     return { ...state, isLoaded: payload };
    // },
    // [SET_STATUE]: (state, { payload }) => {
    //     return { ...state, statueInfoList: payload };
    // },
    // [SET_MOB]: (state, { payload }) => {
    //     return { ...state, mobInfoList: payload };
    // },
    // [SET_STAGE]: (state, { payload }) => {
    //     return { ...state, stageInfoList: payload };
    // },
    // [SET_REQUIRED_EXP]: (state, { payload }) => {
    //     return { ...state, requiredExpList: payload };
    // },
}, initialState);
