import { createAction, handleActions } from 'redux-actions';
import _ from 'lodash';

const initialState = {
    forgeStatus: [],
};

const INIT_FORGE = 'forge/INIT_FORGE';
const START_WORKING = 'forge/START_WORKING';
const SET_MESSAGE = 'forge/SET_MESSAGE';
const FINISH_WORKING = 'forge/FINISH_WORKING';

export const initForgeStatus = createAction(INIT_FORGE);
export const startWorking = createAction(START_WORKING);
export const setMessage = createAction(SET_MESSAGE);
export const finishWorking = createAction(FINISH_WORKING);

export default handleActions({
    [INIT_FORGE]: (state, { payload: length }) => ({
        ...state,
        forgeStatus: _.times(length, _.constant(_.fill(Array(5), {
            isWorking: false,
            message: '',
        }))),
    }),
    [START_WORKING]: (state, { payload: { statueNo, part, message } }) => {
        return {
            ...state,
            forgeStatus: state.forgeStatus.map((statue, i) => {
                if(i===statueNo) {
                    return statue.map((partInfo, i) => {
                        if(i===part-1) {
                            return {
                                ...partInfo,
                                isWorking: true,
                                message: message,
                            }
                        } else return partInfo;
                    })
                } else return statue;
            })
        }
    },
    [SET_MESSAGE]: (state, { payload: { statueNo, part, message } }) => {
        return {
            ...state,
            forgeStatus: state.forgeStatus.map((statue, i) => {
                if(i===statueNo) {
                    return statue.map((partInfo, i) => {
                        if(i===part-1) {
                            return {
                                ...partInfo,
                                message: message
                            };
                        } else return partInfo;
                    })
                } else return statue;
            })
        }
    },
    [FINISH_WORKING]: (state, { payload: { statueNo, part } }) => {
        return {
            ...state,
            forgeStatus: state.forgeStatus.map((statue, i) => {
                if(i===statueNo) {
                    return statue.map((partInfo, i) => {
                        if(i===part-1) {
                            return {
                                ...partInfo,
                                isWorking: false,
                                message: '',
                            }
                        } else return partInfo;
                    })
                } else return statue;
            })
        }
    },
}, initialState);