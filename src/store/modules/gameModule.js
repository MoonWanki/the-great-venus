import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    isLoaded: false,
    statueInfoList: null,
    mobInfoList: null,
    stageInfoList: null,
    requiredExpList: null,
};

const SET_LOADED = 'game/SET_LOADED';
const SET_STATUE = 'game/SET_STATUE';
const SET_MOB = 'game/SET_MOB';
const SET_STAGE = 'game/SET_STAGE';
const SET_REQUIRED_EXP = 'game/SET_REQUIRED_EXP';

export const loadConfig = web3Instance => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    let TGVInstance, promises;
    TGV.deployed()
    .then(instance => {
        TGVInstance = instance;
        promises = [];
        for(var i=1 ; i<=20 ; i++) {
            promises.push(TGVInstance.statueInfoList(i));
        }
        return Promise.all(promises);
    }).then(statueInfoList => {
        dispatch({ type: SET_STATUE, payload: statueInfoList });
        promises = [];
        for(var i=1 ; i<=20 ; i++) {
            promises.push(TGVInstance.mobInfoList(i));
        }
        return Promise.all(promises);
    }).then(mobInfoList => {
        dispatch({ type: SET_MOB, payload: mobInfoList });
        promises = [];
        for(var i=1 ; i<=20 ; i++) {
            promises.push(TGVInstance.requiredExp(i));
        }
        return Promise.all(promises);
    }).then(requiredExpList => {
        dispatch({ type: SET_REQUIRED_EXP, payload: requiredExpList });
        dispatch({ type: SET_LOADED, payload: true });
    }).catch(err => {
        dispatch({ type: SET_LOADED, payload: false });
        console.error(err);
    });
}

export default handleActions({
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
