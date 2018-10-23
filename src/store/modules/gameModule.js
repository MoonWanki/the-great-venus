import { createAction, handleActions } from 'redux-actions';
import * as TGVApi from 'utils/TGVApi';

const initialState = {
    isPending: false,
    isLoaded: false,
    gameData: null,
};

const LOAD_GAME = 'game/LOAD_GAME';
const LOAD_GAME_PENDING = 'game/LOAD_GAME_PENDING';
const LOAD_GAME_FULFILLED = 'game/LOAD_GAME_FULFILLED';
const LOAD_GAME_REJECTED = 'game/LOAD_GAME_REJECTED';

export const fetchGameData = createAction(LOAD_GAME, async (TGVInstance) => await TGVApi.getGameData(TGVInstance));

export default handleActions({
    [LOAD_GAME_PENDING]: (state) => {
        return {
            ...state,
            isPending: true,
        };
    },
    [LOAD_GAME_FULFILLED]: (state, { payload }) => {
        return {
            ...state,
            isPending: false,
            isLoaded: true,
            gameData: payload,
        };
    },
    [LOAD_GAME_REJECTED]: (state) => {
        return {
            ...state,
            isPending: false,
            isLoaded: false,
        };
    },
}, initialState);