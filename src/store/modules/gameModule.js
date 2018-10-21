import { handleActions } from 'redux-actions';
import * as TGVApi from 'utils/TGVApi';

const initialState = {
    isLoaded: false,
    gameData: null,
};

const SET_LOADED = 'game/SET_LOADED';
const SET_GAME_DATA = 'game/SET_GAME_DATA';

export const loadGameData = TGVInstance => async dispatch => {

    try {
        const gameData = await TGVApi.getGameData(TGVInstance);
        dispatch({
            type: SET_GAME_DATA,
            payload: gameData
        });
        dispatch({
            type: SET_LOADED,
            payload: true
        });
    } catch(err) {
        dispatch({
            type: SET_LOADED,
            payload: false
        });
        console.error(err);
    }
}

export default handleActions({
    [SET_LOADED]: (state, { payload }) => {
        return { ...state, isLoaded: payload };
    },
    [SET_GAME_DATA]: (state, { payload }) => {
        return { ...state, gameData: payload };
    },
}, initialState);
