import { createAction, handleActions } from 'redux-actions';

const initialState = {
    contentWidth: screen.width >= screen.height/9*16 ? screen.width : screen.height/9*16,
    contentHeight: screen.width >= screen.height/9*16 ? screen.width/16*9 : screen.height,
    contentX: 0,
    contentY: 0,
};

const SET_CONTENT_POSITION = 'canvas/SET_CONTENT_POSITION';

export const setContentPosition = createAction(SET_CONTENT_POSITION);

export default handleActions({
    [SET_CONTENT_POSITION]: (state, { payload }) => ({
        ...state,
        contentX: payload.stageWidth/2 - state.contentWidth/2,
        contentY: payload.stageHeight/2 - state.contentHeight/2,
    }),
}, initialState);