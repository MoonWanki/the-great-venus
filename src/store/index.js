import { createStore, applyMiddleware } from 'redux';
import modules from './modules';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

// const reduxDevTool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const logger = createLogger(); 

export default createStore(modules, applyMiddleware(logger, ReduxThunk));