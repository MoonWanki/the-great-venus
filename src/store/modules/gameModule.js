import { createAction, handleActions } from 'redux-actions';
import * as TGVApi from 'utils/TGVApi';

const initialState = {
    isPending: false,
    isLoaded: false,
    gameData: null,
    isBlacksmithWorking: false,
};

const LOAD_GAME = 'game/LOAD_GAME';
const LOAD_GAME_PENDING = 'game/LOAD_GAME_PENDING';
const LOAD_GAME_FULFILLED = 'game/LOAD_GAME_FULFILLED';
const LOAD_GAME_REJECTED = 'game/LOAD_GAME_REJECTED';
const SET_BLACKSMITH_WORKING = 'game/SET_BLACKSMITH_WORKING';

export const fetchGameData = createAction(LOAD_GAME, async TGVInstance => await TGVApi.getGameData(TGVInstance));

export const setBlacksmithWorking = createAction(SET_BLACKSMITH_WORKING);

export default handleActions({
    [LOAD_GAME_PENDING]: state => ({
        ...state,
        isPending: true,
    }),
    [LOAD_GAME_FULFILLED]: (state, { payload }) => ({
        ...state,
        isPending: false,
        isLoaded: true,
        gameData: payload,
    }),
    [LOAD_GAME_REJECTED]: state => ({
        ...state,
        isPending: false,
        isLoaded: false,
    }),
    [SET_BLACKSMITH_WORKING]: (state, { payload }) => ({
        ...state,
        isBlacksmithWorking: payload,
    }),
}, initialState);