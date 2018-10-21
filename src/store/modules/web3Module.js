import { createAction, handleActions } from 'redux-actions';

const initialState = {
    web3Instance: null,
    TGVInstance: null,
    selectedAddress: null,
    networkVersion: null,
};

const FETCH_WEB3_INSTANCE = 'web3/FETCH_WEB3_INSTANCE';
const FETCH_TGV_INSTANCE = 'web3/FETCH_TGV_INSTANCE';
const SET_SELECTED_ADDRESS = 'web3/SET_SELECTED_ADDRESS';

export const fetchWeb3Instance = createAction(FETCH_WEB3_INSTANCE);
export const setSelectedAddress = createAction(SET_SELECTED_ADDRESS);
export const fetchTGVInstance = createAction(FETCH_TGV_INSTANCE);

export default handleActions({
    [FETCH_WEB3_INSTANCE]: (state, { payload }) => {
        console.log("web3 fetched!");
        return {
            ...state,
            web3Instance: payload,
            selectedAddress: payload.currentProvider.publicConfigStore._state.selectedAddress,
            networkVersion: payload.currentProvider.publicConfigStore._state.networkVersion,
        };
    },
    [FETCH_TGV_INSTANCE]: (state, { payload }) => {
        return {
            ...state,
            TGVInstance: payload,
        };
    },
    [SET_SELECTED_ADDRESS]: (state, { payload }) => {
        console.log(`${state.selectedAddress} -> ${payload}`);
        return {
            ...state,
            selectedAddress: payload
        };
    },
}, initialState);
