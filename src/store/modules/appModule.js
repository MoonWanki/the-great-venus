import { createAction, handleActions } from 'redux-actions';

const initialState = {
    language: 'en',
    isGameLoaded: false,
};

const SET_LANGUAGE = 'app/SET_LANGUAGE';
const GAME_HAS_LOADED = 'app/GAME_HAS_LOADED';

export const setLanguage = createAction(SET_LANGUAGE);
export const gameHasLoaded = createAction(GAME_HAS_LOADED);

export default handleActions({
    [SET_LANGUAGE]: (state, { payload }) => {
        return {
            ...state,
            language: payload
        };
    },
    [GAME_HAS_LOADED]: (state) => {
        return {
            ...state,
            isGameLoaded: true
        };
    },
}, initialState);
