import { createAction, handleActions } from 'redux-actions';

const initialState = {
    language: 'en',
    nicknameInputOn: false,
    nicknameInputValue: '',
};

const SET_LANGUAGE = 'app/SET_LANGUAGE';
const SET_NICKNAME_INPUT = 'app/app/SET_NICKNAME_INPUT';
const OPEN_NICKNAME_INPUT = 'app/OPEN_NICKNAME_INPUT';
const CLOSE_NICKNAME_INPUT = 'app/CLOSE_NICKNAME_INPUT';

export const setLanguage = createAction(SET_LANGUAGE);
export const setNicknameInput = createAction(SET_NICKNAME_INPUT);
export const openNicknameInput = createAction(OPEN_NICKNAME_INPUT);
export const closeNicknameInput = createAction(CLOSE_NICKNAME_INPUT);

export default handleActions({
    [SET_LANGUAGE]: (state, { payload }) => {
        return {
            ...state,
            language: payload
        };
    },
    [SET_NICKNAME_INPUT]: (state, { payload }) => {
        return {
            ...state,
            nicknameInputValue: payload,
        };
    },
    [OPEN_NICKNAME_INPUT]: state => {
        return {
            ...state,
            nicknameInputOn: true,
        };
    },
    [CLOSE_NICKNAME_INPUT]: state => {
        return {
            ...state,
            nicknameInputOn: false,
        };
    },
}, initialState);
