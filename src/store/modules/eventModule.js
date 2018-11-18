import { createAction, handleActions } from 'redux-actions';

const initialState = {
    dashboardTextList: [],
    eventStore: [],
};

const ADD_TO_DASHBOARD = 'event/ADD_TO_DASHBOARD';
const ADD_TO_EVENT_STORE = 'event/ADD_TO_EVENT_STORE'

export const addToDashboard = createAction(ADD_TO_DASHBOARD);
export const addToEventStore = createAction(ADD_TO_EVENT_STORE);

export default handleActions({
    [ADD_TO_DASHBOARD]: (state, { payload }) => {
        if(state.dashboardTextList.length >= 50) {
            return {
                ...state,
                dashboardTextList: state.dashboardTextList.slice(1).concat(payload),
            }
        } else {
            return {
                ...state,
                dashboardTextList: state.dashboardTextList.concat(payload),
            }
        }
    },
    [ADD_TO_EVENT_STORE]: (state, { payload }) => {
        if(state.eventStore.length >= 50) {
            return {
                ...state,
                eventStore: state.eventStore.slice(1).concat(payload),
            }
        } else {
            return {
                ...state,
                eventStore: state.eventStore.concat(payload),
            }
        }
    },
}, initialState);