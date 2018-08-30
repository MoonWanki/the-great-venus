import { createStore, applyMiddleware } from 'redux';
import modules from './modules';
import ReduxThunk from 'redux-thunk'

//const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export default createStore(modules, applyMiddleware(ReduxThunk));