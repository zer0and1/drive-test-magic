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

import { disableStackCapturing, withTask } from 'react-palm/tasks';
import { GRAPHQL_QUERY_TASK } from 'tasks/tasks';
import { GQL_GET_MINIONS } from 'graphqls';
import { loadMinionsSuccess, loadMinionsError } from 'actions/minion-state-actions';
import { SIGNAL_QUALITY } from 'constants/default-settings';

// react-palm
// disable capture exception for react-palm call to withTask
disableStackCapturing();

/**
 * Updaters for `minionState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 *
 * @public
 * @example
 *
 * import keplerGlReducer, {minionStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             minionState: minionStateUpdaters.enlargeFilterUpdater(
 *               state.keplerGl.foo.minionState,
 *               {idx: 0}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */
/* eslint-disable no-unused-vars */
// @ts-ignore
const minionStateUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Default initial `minionState`
 * @memberof minionStateUpdaters
 * @constant
 * @type {minionState}
 * @public
 */
export const INITIAL_MINION_STATE = {
  details: {},
  selectedMinionName: null,
  selectedMinionIdx: -1,
  operationMode: null,
  sleepInterval: null,
  sessionId: null,
  lastAck: null,
  command: null,
  isCommandExecuting: false,
};

/**
 * Start to load minions data
 * @type {typeof import('./minion-state-updaters').loadMinionsUpdater}
 *
 */
export function loadMinionsUpdater(state, { onLoaded }) {
  const query = GQL_GET_MINIONS(state.selectedMinionName);
  const loadMinionTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
    result => {
      const minions = result.data.signal_db_minions;
      const sample = result.data.signal_db_signal_samples?.[0];
      
      onLoaded(minions?.[state.selectedMinionIdx], minions);
      
      return loadMinionsSuccess(minions, sample);
    },
    error => loadMinionsError(error)
  );
  const newState = {
    ...state,
    isLoadingMinions: true
  };

  return withTask(newState, loadMinionTask);
}


export function calcLevel(val, factor, type) {
  let quality = [];

  if (factor == 'sinr_ecio') {
    quality = SIGNAL_QUALITY[type == 'LTE' ? 'sinr' : 'ecio'];
  }
  else {
    quality = SIGNAL_QUALITY[factor];
  }

  const lvls = quality.length - 1;

  for (let i = 1; i <= lvls; i++) {
    if (parseInt(val) >= parseInt(quality[i])) {
      return {
        [factor + '_level']: i - 1,
        [factor + '_prog']: (lvls - i) * 25 + 25 * (val - quality[i]) / (quality[i - 1] - quality[i])
      };
    }
  }

  return {
    [factor + '_level']: lvls,
    [factor + '_prog']: 0
  };
};

/**
 * Process loaded minions data
 * @type {typeof import('./minion-state-updaters').loadMinionsSuccessUpdater}
 *
 */
export function loadMinionsSuccessUpdater(state, { minions, signalSample }) {
  const newState = {
    ...state,
    isLoadingMinions: false,
    details: {}
  };

  if (state.selectedMinionIdx < 0 || ! signalSample) {
    return newState;
  }

  const minionDetails = minions?.[state.selectedMinionIdx];
  const connectionType = signalSample.connection_type;
  const { rssi, rsrq, rsrp_rscp, sinr_ecio } = signalSample;
  const details = {
    ...minionDetails,
    ...signalSample,
    ...calcLevel(rssi, 'rssi', connectionType),
    ...calcLevel(rsrq, 'rsrq', connectionType),
    ...calcLevel(rsrp_rscp, 'rsrp_rscp', connectionType),
    ...calcLevel(sinr_ecio, 'sinr_ecio', connectionType),
    cqi: 0,
  };

  return {
    ...newState,
    details,
    operationMode: details.operation_mode,
    sessionId: details.session_id,
  }
}

/**
 * Handle error occured in loading minions data
 * @type {typeof import('./minion-state-updaters').loadMinionsSuccessUpdater}
 *
 */
export function loadMinionsErrorUpdater(state, { error }) {
  return {
    ...state,
    isLoadingMinions: false,
    error
  }
}

/**
 * Set selected minion's name and index
 * @type {typeof import('./minion-state-updaters').setSelectedMinionUpdater}
 *
 */
export function setSelectedMinionUpdater(state, { name, idx }) {
  return {
    ...state,
    selectedMinionName: name,
    selectedMinionIdx: idx
  };
}

/**
 * Set minion sleep interval
 * @type {typeof import('./minion-state-updaters').setSleepIntervalUpdater}
 *
 */
export function setSleepIntervalUpdater(state, { interval }) {
  return {
    ...state,
    sleepInterval: interval
  };
}

/**
 * Set minion sleep interval
 * @type {typeof import('./minion-state-updaters').setOperationMode}
 *
 */
export function setOperationModeUpdater(state, { mode }) {
  return {
    ...state,
    operationMode: mode
  };
}

/**
 * Set minion sleep interval
 * @type {typeof import('./minion-state-updaters').increaseSessionId}
 *
 */
export function increaseSessionIdUpdater(state) {
  return {
    ...state,
    sessionId: state.sessionId == null ? 1 : state.sessionId + 1
  };
}

/**
 * Set command to selected minion
 * @type {typeof import('./minion-state-updaters').setCommand}
 *
 */
export function setCommandUpdater(state, { command }) {
  return {
    ...state,
    command
  };
}

/**
 * Send command to selected minion
 * @type {typeof import('./minion-state-updaters').setCommand}
 *
 */
export function sendCommandUpdater(state) {
  alert(state.command);
  return state;
}

