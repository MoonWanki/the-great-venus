import { createAction, handleActions } from 'redux-actions';

const initialState = {
    web3Instance: null,
    selectedAddress: null,
    networkVersion: null,
};

const INITIALIZE_WEB3 = 'web3/INITIALIZE_WEB3';

export const initializeWeb3 = createAction(INITIALIZE_WEB3);

export default handleActions({
    [INITIALIZE_WEB3]: (state, { payload }) => {
        console.log("web3 initialized!");
        return {
            ...state,
            web3Instance: payload,
            selectedAddress: payload.currentProvider.publicConfigStore._state.selectedAddress,
            networkVersion: payload.currentProvider.publicConfigStore._state.networkVersion,
        };
    }
}, initialState);
