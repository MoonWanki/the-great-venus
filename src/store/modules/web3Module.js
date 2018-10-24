import { createAction, handleActions } from 'redux-actions';
import { getWeb3, getTGV } from 'utils/InstanceFactory';

const initialState = {
    isWeb3Pending: false,
    isWeb3Error: false,
    web3: null,
    isTGVPending: false,
    isTGVError: false,
    TGV: null,
};

const LOAD_WEB3 = 'web3/LOAD_WEB3';
const LOAD_WEB3_PENDING = 'web3/LOAD_WEB3_PENDING';
const LOAD_WEB3_FULFILLED = 'web3/LOAD_WEB3_FULFILLED';
const LOAD_WEB3_REJECTED = 'web3/LOAD_WEB3_REJECTED';

const LOAD_TGV = 'web3/LOAD_TGV';
const LOAD_TGV_PENDING = 'web3/LOAD_TGV_PENDING';
const LOAD_TGV_FULFILLED = 'web3/LOAD_TGV_FULFILLED';
const LOAD_TGV_REJECTED = 'web3/LOAD_TGV_REJECTED';

export const fetchWeb3 = createAction(LOAD_WEB3, async () => await getWeb3());
export const fetchTGV = createAction(LOAD_TGV, async (web3) => await getTGV(web3));

export default handleActions({
    [LOAD_WEB3_PENDING]: state => {
        return {
            ...state,
            isWeb3Pending: true,
        };
    },
    [LOAD_WEB3_FULFILLED]: (state, { payload }) => {
        return {
            ...state,
            isWeb3Pending: false,
            web3: payload,
        };
    },
    [LOAD_WEB3_REJECTED]: state => {
        return {
            ...state,
            isWeb3Pending: false,
            isWeb3Error: true
        };
    },
    [LOAD_TGV_PENDING]: state => {
        return {
            ...state,
            isTGVPending: true,
        };
    },
    [LOAD_TGV_FULFILLED]: (state, { payload }) => {
        return {
            ...state,
            isTGVPending: false,
            TGV: payload,
        };
    },
    [LOAD_TGV_REJECTED]: state => {
        return {
            ...state,
            isTGVPending: false,
            isTGVError: true
        };
    },
}, initialState);
