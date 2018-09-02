import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    isLoading: false,
    isLoaded: false,
    statueInfoList: null,
    mobInfoList: null,
    stageInfoList: null,
    requiredExpList: null,
};

const SET_LOADING = 'admin/SET_LOADING';
const SET_LOADED = 'admin/SET_LOADED';
const SET_STATUE = 'admin/SET_STATUE';
const SET_MOB = 'admin/SET_MOB';
const SET_STAGE = 'admin/SET_STAGE';
const SET_REQUIRED_EXP = 'admin/SET_REQUIRED_EXP';


export const setConfigToDefault = web3Instance => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    dispatch({ type: SET_LOADING, payload: true });

    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                return instance.setToDefault({ from: coinbase });
            }).then(() => {
                console.log("기본값으로 설정됨");
                dispatch({ type: SET_LOADING, payload: false });
            }).catch(err => {
                dispatch({ type: SET_LOADING, payload: false });
                console.error(err);
            })
        } else {
            dispatch({ type: SET_LOADING, payload: false });
            console.error("error in getCoinbase()");
        }
    });
}

export const loadConfig = web3Instance => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    dispatch({ type: SET_LOADING, payload: true });
    let TGVInstance, promises;

    web3Instance.eth.getCoinbase((err, coinbase) => {
        if (!err) {
            TGV.deployed()
            .then(instance => {
                TGVInstance = instance;
                dispatch({ type: SET_LOADING, payload: false });
                promises = [];
                for(var i=1 ; i<=10 ; i++) {
                    promises.push(TGVInstance.statueInfoList(i));
                }
                return Promise.all(promises);
            }).then(statueInfoList => {
                dispatch({ type: SET_STATUE, payload: statueInfoList });
                promises = [];
                for(var i=1 ; i<=10 ; i++) {
                    promises.push(TGVInstance.mobInfoList(i));
                }
                return Promise.all(promises);
            }).then(mobInfoList => {
                dispatch({ type: SET_MOB, payload: mobInfoList });
                promises = [];
                for(var i=1 ; i<=15 ; i++) {
                    promises.push(TGVInstance.requiredExp(i));
                }
                return Promise.all(promises);
            }).then(requiredExpList => {
                dispatch({ type: SET_REQUIRED_EXP, payload: requiredExpList });
                dispatch({ type: SET_LOADING, payload: false });
                dispatch({ type: SET_LOADED, payload: true });
            }).catch(err => {
                dispatch({ type: SET_LOADING, payload: false });
                console.error(err);
            })
        } else {
            dispatch({ type: SET_LOADING, payload: false });
            console.error("error in getCoinbase()");
        }
    });
}

export default handleActions({
    [SET_LOADING]: (state, { payload }) => {
        return { ...state, isLoading: payload };
    },
    [SET_LOADED]: (state, { payload }) => {
        return { ...state, isLoaded: payload };
    },
    [SET_STATUE]: (state, { payload }) => {
        return { ...state, statueInfoList: payload };
    },
    [SET_MOB]: (state, { payload }) => {
        return { ...state, mobInfoList: payload };
    },
    [SET_STAGE]: (state, { payload }) => {
        return { ...state, stageInfoList: payload };
    },
    [SET_REQUIRED_EXP]: (state, { payload }) => {
        return { ...state, requiredExpList: payload };
    },
}, initialState);
