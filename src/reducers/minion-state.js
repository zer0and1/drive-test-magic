// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import ActionTypes from 'constants/action-types';
import {handleActions} from 'redux-actions';
import * as minionStateUpdaters from './minion-state-updaters';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.SET_LOOPING_ENABLED]: minionStateUpdaters.setLoopingEnabledUpdater,
  [ActionTypes.LOAD_MINIONS]: minionStateUpdaters.loadMinionsUpdater,
  [ActionTypes.LOAD_MINIONS_SUCCESS]: minionStateUpdaters.loadMinionsSuccessUpdater,
  [ActionTypes.LOAD_MINIONS_ERROR]: minionStateUpdaters.loadMinionsErrorUpdater,
  [ActionTypes.SET_SLEEP_INTERVAL]: minionStateUpdaters.setSleepIntervalUpdater,
  [ActionTypes.SELECT_MINION]: minionStateUpdaters.selectMinionUpdater,
  [ActionTypes.UNSELECT_MINION]: minionStateUpdaters.unselectMinionUpdater,
  [ActionTypes.SET_OPERATION_MODE]: minionStateUpdaters.setOperationModeUpdater,
  [ActionTypes.SET_SESSION_ID]: minionStateUpdaters.setSessionIdUpdater,
  [ActionTypes.SEND_SESSION_COMMAND]: minionStateUpdaters.sendSessionCommandUpdater,
  [ActionTypes.SET_COMMAND]: minionStateUpdaters.setCommandUpdater,
  [ActionTypes.SEND_COMMAND]: minionStateUpdaters.sendCommandUpdater,
  [ActionTypes.SET_MQTT_CLIENT]: minionStateUpdaters.setMqttClientUpdater,
  [ActionTypes.SET_MQTT_MESSAGE]: minionStateUpdaters.setMqttMessageUpdater,
  [ActionTypes.LOAD_MINION_COMMAND]: minionStateUpdaters.loadMinionCommandUpdater,
  [ActionTypes.LOAD_MINION_COMMAND_SUCCESS]: minionStateUpdaters.loadMinionCommandSuccessUpdater,
  [ActionTypes.SELECT_ALL]: minionStateUpdaters.selectAllUpdater,
  [ActionTypes.EXPAND]: minionStateUpdaters.expandUpdater,
  [ActionTypes.COLLAPSE]: minionStateUpdaters.collapseUpdater,
  [ActionTypes.SET_MARKER_SCALE]: minionStateUpdaters.setMarkerScaleUpdater,
  [ActionTypes.DELETE_FILTERED_DATA]: minionStateUpdaters.deleteFilteredDataUpdater,
  [ActionTypes.DELETE_FILTERED_DATA_SUCCESS]: minionStateUpdaters.deleteFilteredDataSuccessUpdater,
  [ActionTypes.DELETE_FILTERED_DATA_ERROR]: minionStateUpdaters.deleteFilteredDataErrorUpdater,
};

// construct vis-state reducer
export const minionStateReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {
    ...minionStateUpdaters.INITIAL_MINION_STATE,
    ...initialState,
    initialState
  });

export default minionStateReducerFactory();
