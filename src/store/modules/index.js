import { combineReducers } from 'redux';
import userModule from './userModule';
import web3Module from './web3Module';

export default combineReducers({ web3Module, userModule });