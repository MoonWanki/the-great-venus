import { combineReducers } from 'redux';
import userModule from './userModule';
import web3Module from './web3Module';
import appModule from './appModule';
import gameModule from './gameModule';
import canvasModule from './canvasModule';
import forgeModule from './forgeModule';
import eventModule from './eventModule';

export default combineReducers({ web3Module, userModule, appModule, gameModule, canvasModule, forgeModule, eventModule });