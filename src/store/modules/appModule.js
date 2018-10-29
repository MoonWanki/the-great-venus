import { createAction, handleActions } from 'redux-actions';

const initialState = {
    language: 'en',
    nicknameModalOn: false,
};

const SET_LANGUAGE = 'app/SET_LANGUAGE';
const OPEN_NICKNAME_MODAL = 'app/OPEN_NICKNAME_MODAL';
const CLOSE_NICKNAME_MODAL = 'app/CLOSE_NICKNAME_MODAL';

export const setLanguage = createAction(SET_LANGUAGE);

export default handleActions({
    [SET_LANGUAGE]: (state, { payload }) => {
        return {
            ...state,
            language: payload
        };
    },
    [OPEN_NICKNAME_MODAL]: (state, { payload }) => {
        return {
            ...state,
            nicknameModalOn: true,
        };
    },
    [CLOSE_NICKNAME_MODAL]: (state, { payload }) => {
        return {
            ...state,
            nicknameModalOn: false,
        };
    },
}, initialState);
