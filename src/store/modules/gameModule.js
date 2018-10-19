import { /* createAction, */handleActions } from 'redux-actions';
import abi from '../../../build/contracts/TGV.json';

const contract = require('truffle-contract');

const initialState = {
    isLoaded: false,
    gameData: null,
};

const SET_LOADED = 'game/SET_LOADED';
const SET_GAME_DATA = 'game/SET_GAME_DATA';

export const loadGameData = web3Instance => dispatch => {

    const TGV = contract(abi);
    TGV.setProvider(web3Instance.currentProvider);
    let TGVInstance, promises = [];
    let numStatueInfo, numMobInfo, numStageInfo;
    let statueInfoList, mobInfoList, stageInfoList = [];
    TGV.deployed()
    .then(instance => {
        TGVInstance = instance;
        promises.push(TGVInstance.numStatueInfo.call());
        promises.push(TGVInstance.numMobInfo.call());
        promises.push(TGVInstance.numStageInfo.call());
        return Promise.all(promises);
    }).then(res => {
        numStatueInfo = res[0];
        numMobInfo = res[1];
        numStageInfo = res[2];
        promises = [];
        for(let i=0 ; i<=numStatueInfo ; i++) {
            promises.push(TGVInstance.statueInfoList.call(i));
        }
        return Promise.all(promises);
    }).then(res => {
        statueInfoList = res.map(statueInfo => {
            return {
                hp: statueInfo[0].c[0],
                atk: statueInfo[1].c[0],
                def: statueInfo[2].c[0],
                crt: statueInfo[3].c[0],
                avd: statueInfo[4].c[0],
            }
        });
        promises = [];
        for(let i=1 ; i<=numMobInfo ; i++) {
            promises.push(TGVInstance.mobInfoList.call(i));
        }
        return Promise.all(promises);
    }).then(res => {
        mobInfoList = res.map(mobInfo => {
            return {
                hp: mobInfo[0].c[0],
                atk: mobInfo[1].c[0],
                def: mobInfo[2].c[0],
                crt: mobInfo[3].c[0],
                avd: mobInfo[4].c[0],
            }
        });
        promises = [];
        for(let i=1 ; i<=numStageInfo ; i++) {
            for(let j=0 ; j<15 ; j++) {
                promises.push(TGVInstance.stageInfoList.call(i, j));
            }
        }
        return Promise.all(promises);
    }).then(res => {
        for(let i=0 ; i<numStageInfo ; i++) {
            let stage = [];
            for(let j=0 ; j<3 ; j++) {
                let round = [];
                for(let k=0 ; k<5 ; k++) {
                    round.push(res[i*15 + j*5 + k].c[0]);
                }
                stage.push(round);
            }
            stageInfoList.push(stage);
        }
        dispatch({
            type: SET_GAME_DATA,
            payload: {
                numStatueInfo: numStageInfo,
                statueInfoList: statueInfoList,
                numMobInfo: numMobInfo,
                mobInfoList: mobInfoList,
                numStageInfo: numStageInfo,
                stageInfoList: stageInfoList,
            }
        });
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
