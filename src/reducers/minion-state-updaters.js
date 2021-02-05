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
import { GRAPHQL_QUERY_TASK, ACTION_TASK } from 'tasks/tasks';
import { GQL_GET_MINIONS, GQL_GET_MINION_COMMANDS } from 'graphqls';
import { loadMinionsSuccess, loadMinionsError, loadMinionCommandSuccess } from 'actions/minion-state-actions';
import { updateMap, fitBounds } from 'actions/map-state-actions';
import { SIGNAL_QUALITY } from 'constants/default-settings';
import moment from 'moment';
import _ from 'lodash';

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
  selectedMinions: [],
  operationMode: null,
  sleepInterval: null,
  sessionId: null,
  lastAck: {},
  command: null,
  commands: [],
  isCommandExecuting: false,
  mqttClient: null,
  mqttMessage: null,
  mqttTopic: null,
  selectedAll: false,
  markerScale: 'large',
  minions: []
};

/**
 * Start to load minions data
 * @type {typeof import('./minion-state-updaters').loadMinionsUpdater}
 *
 */
export function loadMinionsUpdater(state, { onLoaded }) {
  const query = GQL_GET_MINIONS(state.selectedMinions[0]?.name);
  const loadMinionTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
    result => {
      const minions = _.sortBy(result.data.signal_db_minions, ['name']);
      const sample = result.data.signal_db_signal_samples?.[0];

      onLoaded(minions);

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
  const { selectedMinions } = state;
  let newState = {
    ...state,
    isLoadingMinions: false,
    isSelectingAll: false,
    isDeselectingAll: false,
    minions,
    details: {}
  };

  if (selectedMinions.length != 1 || !signalSample) {
    return newState;
  }

  const minionDetails = selectedMinions[0];
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
    operationMode: state.operationMode || minionDetails.operation_mode,
    sessionId: state.sessionId || minionDetails.session_id,
    sleepInterval: state.sleepInterval || minionDetails.sleep_interval
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
 * @type {typeof import('./minion-state-updaters').selectMinionUpdater}
 *
 */
export function selectMinionUpdater(state, { minions }) {
  const { mqttClient } = state;

  if (mqttClient) {
    minions.forEach(m => mqttClient.subscribe(`${m.name}/ack`));
  }

  return {
    ...state,
    selectedMinions: minions,
    isSelectingAll: false,
    isDeselectingAll: false
  };
}

/**
 * Set selected minion's name and index
 * @type {typeof import('./minion-state-updaters').selectMinionUpdater}
 *
 */
export function unselectMinionUpdater(state, { name }) {
  const selectedMinions = state.selectedMinions.filter(m => m.name != name);

  return {
    ...state,
    selectedMinions,
    selectedAll: selectedMinions.length != 1
  };
}

/**
 * Set minion sleep interval
 * @type {typeof import('./minion-state-updaters').setSleepIntervalUpdater}
 *
 */
export function setSleepIntervalUpdater(state, { interval }) {
  const { mqttClient, selectedMinions, selectedAll } = state;

  if (!mqttClient || selectedMinions.length == 0) {
    return state;
  }

  selectedMinions.forEach(({ name }) => {
    const topic = `${name}/interval`;
    mqttClient.subscribe(topic, err => {
      err || mqttClient.publish(topic, interval.toString());
    });
  });


  return {
    ...state,
    isCommandExecuting: true,
    sleepInterval: selectedAll ? null : interval
  };
}

/**
 * Set minion sleep interval
 * @type {typeof import('./minion-state-updaters').setOperationMode}
 *
 */
export function setOperationModeUpdater(state, { mode }) {
  const { mqttClient, selectedMinions, selectedAll } = state;

  if (!mqttClient || selectedMinions.length == 0) {
    return state;
  }

  selectedMinions.forEach(({ name }) => {
    const topic = `${name}/operation_mode`;
    mqttClient.subscribe(topic, err => {
      err || mqttClient.publish(topic, mode.toString());
    });
  });

  return {
    ...state,
    isCommandExecuting: true,
    operationMode: selectedAll ? null : mode
  };
}

/**
 * Set minion sleep interval
 * @type {typeof import('./minion-state-updaters').sendSessionCommandUpdater}
 *
 */
export function sendSessionCommandUpdater(state, { isIncrement }) {
  const { mqttClient, selectedMinions, sessionId, selectedAll } = state;

  if (!mqttClient || selectedMinions.length == 0) {
    return state;
  }

  const payload = isIncrement ? 'increment' : sessionId.toString();
  selectedMinions.forEach(({ name }) => {
    const topic = `${name}/session_id`;
    mqttClient.subscribe(topic, err => {
      err || mqttClient.publish(topic, payload);
    });
  });

  return {
    ...state,
    isCommandExecuting: true,
    sessionId: selectedAll ? null : (isIncrement ? parseInt(state.sessionId) + 1 : state.sessionId)
  };
}

/**
 * Set minion session id
 * @type {typeof import('./minion-state-updaters').setSessionId}
 *
 */
export function setSessionIdUpdater(state, { sessionId }) {
  return {
    ...state,
    sessionId
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
  const { mqttClient, selectedMinions, command } = state;

  if (!mqttClient || !command || selectedMinions.length == 0) {
    return state;
  }

  selectedMinions.forEach(({ name }) => {
    const topic = `${name}/command`;
    mqttClient.subscribe(topic, err => {
      err || mqttClient.publish(topic, command.toString());
    });
  });

  return {
    ...state,
    isCommandExecuting: true
  };
}

/**
 * Set mqtt client connected
 * @type {typeof import('./minion-state-updaters').setMqttClientUpdater}
 *
 */
export function setMqttClientUpdater(state, { mqttClient }) {
  return {
    ...state,
    mqttClient
  };
}

/**
 * Set mqtt message received
 * @type {typeof import('./minion-state-updaters').setMqttMessageUpdater}
 *
 */
export function setMqttMessageUpdater(state, { mqttTopic: topic, mqttMessage: payload }) {
  const { lastAck } = state;
  topic = topic.toString();
  payload = payload.toString();
  const minion = topic.split('/')?.[0];
  const cmd = topic.split('/')?.[1];

  const reflections = {
    ack: {
      lastAck: {
        ...lastAck,
        [minion]: payload + moment().format(' @ HH:mm:ss')
      }
    },
    command: { command: payload },
    operation_mode: { operationMode: payload },
    interval: { sleepInterval: parseFloat(payload) },
    session_id: { sessionId: parseInt(payload) },
  };

  return {
    ...state,
    isCommandExecuting: false,
    ...(reflections?.[cmd])
  };
}

export function loadMinionCommandUpdater(state) {
  const query = GQL_GET_MINION_COMMANDS();
  const task = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
    res => loadMinionCommandSuccess(res.data.signal_db_minion_commands),
    err => { }
  );

  return withTask(state, task);
}

export function loadMinionCommandSuccessUpdater(state, { commands }) {
  return {
    ...state,
    commands: commands.map(c => c.command)
  }
}

export function selectAllUpdater(state) {
  const { minions, selectedMinions } = state;
  return {
    ...state,
    selectedMinions: state.minions,
    operationMode: null,
    sleepInterval: null,
    sessionId: null,
    lastAck: {},
    command: null,
    isSelectingAll: minions.length != selectedMinions.length,
    isDeselectingAll: minions.length == selectedMinions.length,
  }
}

export function expandUpdater(state) {
  const { minions } = state;

  if (minions.length == 0) {
    return state;
  }
  else if (minions.length == 1) {
    const { longitude, latitude } = minions[0];
    const task = ACTION_TASK().map(_ => updateMap({ longitude, latitude }));

    return withTask(state, task);
  }

  const { minLat, minLnt, maxLat, maxLnt } = minions.reduce((acc, { latitude: lat, longitude: lnt }) => {
    if (acc.minLat > lat) {
      acc.minLat = lat;
    }
    if (acc.minLnt > lnt) {
      acc.minLnt = lnt;
    }
    if (acc.maxLat < lat) {
      acc.maxLat = lat;
    }
    if (acc.maxLnt < lnt) {
      acc.maxLnt = lnt;
    }

    return acc;
  }, { minLat: 90, minLnt: 180, maxLat: -90, maxLnt: -180 });

  const task = ACTION_TASK().map(_ => fitBounds([
    minLnt,
    minLat,
    maxLnt,
    maxLat,
    true
  ]));

  return withTask(state, task);
}

export function collapseUpdater(state) {
  const { selectedMinions } = state;

  if (selectedMinions.length == 0) {
    return state;
  }

  const { longitude, latitude } = selectedMinions[0];
  const task = ACTION_TASK().map(_ => updateMap({ longitude, latitude }));

  return withTask(state, task);
}

export function setMarkerScaleUpdater(state, { markerScale }) {
  return {
    ...state,
    markerScale
  }
}
