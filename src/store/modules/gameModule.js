import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    isLoaded: false,
    gameData: null,
};

const SET_LOADED = 'game/SET_LOADED';
const SET_GAME_DATA = 'game/SET_GAME_DATA';

export const loadConfig = web3Instance => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    let TGVInstance, promises, gameData;
    TGV.deployed()
    .then(instance => {
        TGVInstance = instance;
        promises = [];
        for(var i=1 ; i<=20 ; i++) {
            promises.push(TGVInstance.statueInfoList.call(i));
        }
        return Promise.all(promises);
    }).then(res => {
        gameData = { ...gameData, statueInfoList: res };
        promises = [];
        for(var i=1 ; i<=20 ; i++) {
            promises.push(TGVInstance.mobInfoList.call(i));
        }
        return Promise.all(promises);
    }).then(res => {
        gameData = { ...gameData, mobInfoList: res };
        promises = [];
        for(var i=1 ; i<=20 ; i++) {
            promises.push(TGVInstance.getRequiredExp.call(i));
        }
        return Promise.all(promises);
    }).then(res => {
        gameData = { ...gameData, mobInfoList: res };
        dispatch({ type: SET_GAME_DATA, payload: gameData });
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
    [SET_GAME_DATA]: (state, { payload }) => {
        return { ...state, gameData: payload };
    },
}, initialState);
