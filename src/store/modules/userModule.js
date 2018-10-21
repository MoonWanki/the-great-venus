import { handleActions } from 'redux-actions';
import * as TGVApi from 'utils/TGVApi';

const initialState = {
    isLoaded: false,
    userData: null,
    balance: 0,
};

const SET_BALANCE = 'user/SET_BALANCE';
const SET_USER_DATA = 'user/SET_USER_DATA';
const SET_LOADED = 'user/SET_LOADED';

export const loadMyData = (TGVInstance, address) => async dispatch => {

    try {
        const userData = await TGVApi.getUserData(TGVInstance, address);
        dispatch({
            type: SET_USER_DATA,
            payload: userData
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
        return {
            ...state,
            isLoaded: payload
        };
    },
    [SET_USER_DATA]: (state, { payload }) => {
        return {
            ...state,
            userData: payload
        };
    },
    [SET_BALANCE]: (state, { payload }) => {
        const balance = payload.c[0]*(10**5) + payload.c[1]/(10**9);
        return {
            ...state,
            balance: balance
        };
    },
}, initialState);
