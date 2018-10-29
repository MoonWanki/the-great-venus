import { createAction, handleActions } from 'redux-actions';
import * as TGVApi from 'utils/TGVApi';

const initialState = {
    isPending: false,
    isLoaded: false,
    userData: null,
};

// const balance = payload.c[0]*(10**5) + payload.c[1]/(10**9);

const LOAD_USER = 'user/LOAD_USER';
const LOAD_USER_PENDING = 'user/LOAD_USER_PENDING';
const LOAD_USER_FULFILLED = 'user/LOAD_USER_FULFILLED';
const LOAD_USER_REJECTED = 'user/LOAD_USER_REJECTED';
const SET_NICKNAME = 'user/SET_NICKNAME';

export const fetchUserData = createAction(LOAD_USER, async (TGVInstance, address) => await TGVApi.getUserData(TGVInstance, address));

export const setNickname = createAction(SET_NICKNAME);

export default handleActions({
    [LOAD_USER_PENDING]: state => {
        return {
            ...state,
            isPending: true,
        };
    },
    [LOAD_USER_FULFILLED]: (state, { payload }) => {
        return {
            ...state,
            isPending: false,
            isLoaded: true,
            userData: payload,
        };
    },
    [LOAD_USER_REJECTED]: state => {
        return {
            ...state,
            isPending: false,
            isLoaded: false,
        };
    },
    [SET_NICKNAME]: (state, { payload }) => {
        return {
            ...state,
            userData: {
                ...state.userData,
                name: payload,
            }
        };
    },
}, initialState);