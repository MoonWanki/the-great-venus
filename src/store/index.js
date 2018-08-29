import { createStore } from 'redux';
import modules from './modules';

export default createStore(modules, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());