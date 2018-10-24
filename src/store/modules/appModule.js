import { createAction, handleActions } from 'redux-actions';

const initialState = {
    language: 'en',
};

const SET_LANGUAGE = 'app/SET_LANGUAGE';

export const setLanguage = createAction(SET_LANGUAGE);

export default handleActions({
    [SET_LANGUAGE]: (state, { payload }) => {
        return {
            ...state,
            language: payload
        };
    },
}, initialState);
