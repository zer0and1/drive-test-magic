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

// minion-state-reducer
import ActionTypes from 'constants/action-types';


/**
 * Start to load minions data
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').loadMinions}
 * @return action
 */
export function loadMinions(onLoaded) {
  return {
    type: ActionTypes.LOAD_MINIONS,
    onLoaded
  };
}

/**
 * Successfully loaded all minions data
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').loadMinionsSuccess}
 * @return action
 */
export function loadMinionsSuccess(minions, signalSample) {  
  return {
    type: ActionTypes.LOAD_MINIONS_SUCCESS,
    minions,
    signalSample
  };
}

/**
 * Failed to loaded minions data
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').loadMinionsError}
 * @return action
 */
export function loadMinionsError(error) {  
  return {
    type: ActionTypes.LOAD_MINIONS_SUCCESS,
    error
  };
}


/**
 * Set selected minion's id and index
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setSelectedMinion}
 * @return action
 */
export function setSelectedMinion({ name, idx }) {
  return {
    type: ActionTypes.SET_SELECTED_MINION,
    name,
    idx
  };
}

/**
 * Set minion operation mode
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setOperationMode}
 * @return action
 */
export function setOperationMode(mode) {
  return {
    type: ActionTypes.SET_OPERATION_MODE,
    mode
  };
}

/**
 * Set minion sleep interval
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setSleepInterval}
 * @return action
 */
export function setSleepInterval(interval) {
  return {
    type: ActionTypes.SET_SLEEP_INTERVAL,
    interval
  };
}

/**
 * Increase minion session id
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').increaseSessionId}
 * @return action
 */
export function increaseSessionId() {
  return {
    type: ActionTypes.INCREASE_SESSION_ID
  };
}

/**
 * Set minion sleep interval
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').sendCommand}
 * @return action
 */
export function sendCommand(command) {
  return {
    type: ActionTypes.SEND_COMMAND,
    command
  };
}


/**
 * This declaration is needed to group actions in docs
 */
/**
 * Actions handled mostly by `minionState` reducer.
 * They manage how data is processed, filtered and displayed on the map by operates on layers,
 * filters and interaction settings.
 *
 * @public
 */
/* eslint-disable no-unused-vars */
// @ts-ignore
const minionStateActions = null;
/* eslint-enable no-unused-vars */
