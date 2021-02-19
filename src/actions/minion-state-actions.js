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


export function setLoopingEnabled(enabled) {
  return {
    type: ActionTypes.SET_LOOPING_ENABLED,
    enabled
  }
};

/**
 * Start to load minions data
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').loadMinions}
 * @return action
 */
export function loadMinions(firstLoading) {
  return {
    type: ActionTypes.LOAD_MINIONS,
    firstLoading
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
 * @type {typeof import('./minion-state-actions').selectMinion}
 * @return action
 */
export function selectMinion(minions) {
  return {
    type: ActionTypes.SELECT_MINION,
    minions
  };
}

export function unselectMinion(name) {
  return {
    type: ActionTypes.UNSELECT_MINION,
    name
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
 * @type {typeof import('./minion-state-actions').sendSessionCommand}
 * @return action
 */
export function sendSessionCommand(isIncrement) {
  return {
    type: ActionTypes.SEND_SESSION_COMMAND,
    isIncrement
  };
}

/**
 * Set minion session id
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setSessionId}
 * @return action
 */
export function setSessionId(sessionId) {
  return {
    type: ActionTypes.SET_SESSION_ID,
    sessionId
  };
}

/**
 * Set minion command
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setCommand}
 * @return action
 */
export function setCommand(command) {
  return {
    type: ActionTypes.SET_COMMAND,
    command
  };
}

/**
 * Send minion command
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').sendCommand}
 * @return action
 */
export function sendCommand() {
  return {
    type: ActionTypes.SEND_COMMAND,
  };
}

/**
 * Set mqtt client connected
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setMqttClient}
 * @return action
 */
export function setMqttClient(mqttClient) {
  return {
    type: ActionTypes.SET_MQTT_CLIENT,
    mqttClient
  };
}


/**
 * Set mqtt message received
 * @memberof minionStateActions
 * @type {typeof import('./minion-state-actions').setMqttMessage}
 * @return action
 */
export function setMqttMessage(topic, message) {
  return {
    type: ActionTypes.SET_MQTT_MESSAGE,
    mqttTopic: topic,
    mqttMessage: message,
  };
}

export function loadMinionCommand() {
  return {
    type: ActionTypes.LOAD_MINION_COMMAND
  }
}

export function loadMinionCommandSuccess(commands) {
  return {
    type: ActionTypes.LOAD_MINION_COMMAND_SUCCESS,
    commands
  }
};

export function selectAll(selectedAll) {
  return {
    type: ActionTypes.SELECT_ALL,
    selectedAll
  }
};

export function expand() {
  return {
    type: ActionTypes.EXPAND
  }
};

export function collapse() {
  return {
    type: ActionTypes.COLLAPSE
  }
};

export function setMarkerScale(markerScale) {
  return {
    type: ActionTypes.SET_MARKER_SCALE,
    markerScale
  }
};

export function deleteFilteredData(dataset, visState) {
  return {
    type: ActionTypes.DELETE_FILTERED_DATA,
    dataset,
    visState
  }
};

export function deleteFilteredDataSuccess(dataset, visState) {
  return {
    type: ActionTypes.DELETE_FILTERED_DATA_SUCCESS,
    dataset,
    visState
  }
};

export function deleteFilteredDataError(error) {
  return {
    type: ActionTypes.DELETE_FILTERED_DATA_ERROR,
    error
  }
};
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
