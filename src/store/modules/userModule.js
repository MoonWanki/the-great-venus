import { createAction, handleActions } from 'redux-actions';
import * as TGVApi from 'utils/TGVApi';

const initialState = {
    isPending: false,
    isLoaded: false,
    userData: null,
    finney: '잔액을 불러올 수 없습니다.',
};

const LOAD_USER = 'user/LOAD_USER';
const LOAD_USER_PENDING = 'user/LOAD_USER_PENDING';
const LOAD_USER_FULFILLED = 'user/LOAD_USER_FULFILLED';
const LOAD_USER_REJECTED = 'user/LOAD_USER_REJECTED';
const SET_NICKNAME = 'user/SET_NICKNAME';
const SET_FINNEY = 'user/SET_FINNEY';

export const fetchUserData = createAction(LOAD_USER, async (TGV, address) => await TGVApi.getUserData(TGV, address));

export const fetchFinney = web3 => async dispatch => {
    web3.eth.getBalance(web3.eth.coinbase, (err, balance) => {
        if(!err) {
            dispatch({
                type: SET_FINNEY,
                payload: Math.floor(balance.c[0]/10),
            });
        }
    });
}

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
    [SET_FINNEY]: (state, { payload }) => {
        return {
            ...state,
            finney: payload,
        };
    },
}, initialState);