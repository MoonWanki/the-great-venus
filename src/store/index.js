import { createStore, applyMiddleware } from 'redux';
import modules from './modules';
import ReduxThunk from 'redux-thunk';
import ReduxPromiseMiddleware from 'redux-promise-middleware';
// import { createLogger } from 'redux-logger';

//const isDevelopment = process.env.NODE_ENV === 'development';

//const composeEnhancers = isDevelopment ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

export default createStore(modules, applyMiddleware(ReduxThunk, ReduxPromiseMiddleware()));