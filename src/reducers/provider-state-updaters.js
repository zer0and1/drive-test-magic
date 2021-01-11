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

import { withTask } from 'react-palm/tasks';
import { default as Console } from 'global/console';
import { generateHashId, getError, isPlainObject } from 'utils/utils';
import {
  EXPORT_FILE_TO_CLOUD_TASK,
  ACTION_TASK,
  DELAY_TASK,
  LOAD_CLOUD_MAP_TASK,
  GET_SAVED_MAPS_TASK,
  GRAPHQL_QUERY_TASK,
  GRAPHQL_MUTATION_TASK
} from 'tasks/tasks';
import {
  exportFileSuccess,
  exportFileError,
  postSaveLoadSuccess,
  loadCloudMapSuccess,
  getSavedMapsSuccess,
  getSavedMapsError,
  loadCloudMapError,
  resetProviderStatus
} from 'actions/provider-actions';
import { removeNotification, toggleModal, addNotification } from 'actions/ui-state-actions';
import { addDataToMap } from 'actions/actions';
import {
  DEFAULT_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_TOPICS,
  DATASET_FORMATS,
  DATASET_TYPES,
  OVERWRITE_MAP_ID
} from 'constants/default-settings';
import { toArray } from 'utils/utils';
import { FILE_CONFLICT_MSG } from 'cloud-providers';
import { DATASET_HANDLERS } from 'processors/data-processor';
import { gql } from '@apollo/client';
import { GQL_INSERT_DATASET, GQL_GET_DATASETS, GQL_UPDATE_DATASET } from 'graphqls';

import {
  testQuery,
  testQuerySuccess,
  testQueryError,
  loadSession,
  registerDataset,
  registerDatasetSuccess,
  registerDatasetError,
  updateDataset,
  updateDatasetSuccess,
  updateDatasetError,
  loadDatasetSuccess,
  loadDatasetError,
} from '../actions/provider-actions';
import _ from 'lodash';
import moment from 'moment';
import { getFieldsFromData } from 'processors';

export const INITIAL_SESSION_STATE = {
  sessions: [],
  datasetLabel: '',
  labelError: null,
  query: '',
  queryTestResult: null,
  queryError: null,
  queryTestTime: 0,
  queryTestError: null,
  datasetId: '',
  isCheckedSession: false,
  isLoadingSession: false,
  isTestedQuery: false,
  isExpandedQuery: true,
  isExpandedSession: false,
  isAvailableSessionId: false,
  isRegistering: false,
  isUnregistering: false,
  isUpdating: false,
  isLoadingDataset: false,
  selectedSessions: []
};

export const INITIAL_PROVIDER_STATE = {
  isProviderLoading: false,
  isCloudMapLoading: false,
  providerError: null,
  currentProvider: null,
  successInfo: {},
  mapSaved: null,
  visualizations: [],
  ...INITIAL_SESSION_STATE
};

function createActionTask(action, payload) {
  if (typeof action === 'function') {
    return ACTION_TASK().map(_ => action(payload));
  }

  return null;
}

function _validateProvider(provider, method) {
  if (!provider) {
    Console.error(`provider is not defined`);
    return false;
  }

  if (typeof provider[method] !== 'function') {
    Console.error(`${method} is not a function of Cloud provider: ${provider.name}`);
    return false;
  }

  return true;
}

/**
 * @type {typeof import('./provider-state-updaters').createGlobalNotificationTasks}
 */
function createGlobalNotificationTasks({ type, message, delayClose = true }) {
  const id = generateHashId();
  const successNote = {
    id,
    type: DEFAULT_NOTIFICATION_TYPES[type] || DEFAULT_NOTIFICATION_TYPES.success,
    topic: DEFAULT_NOTIFICATION_TOPICS.global,
    message
  };
  const task = ACTION_TASK().map(_ => addNotification(successNote));
  return delayClose ? [task, DELAY_TASK(3000).map(_ => removeNotification(id))] : [task];
}

/**
 * This method will export the current kepler config file to the chosen cloud proder
 * add returns a share URL
 *
 * @type {typeof import('./provider-state-updaters').exportFileToCloudUpdater}
 */
export const exportFileToCloudUpdater = (state, action) => {
  const { mapData, provider, options = {}, onSuccess, onError, closeModal } = action.payload;

  if (!_validateProvider(provider, 'uploadMap')) {
    return state;
  }

  const newState = {
    ...state,
    isProviderLoading: true,
    currentProvider: provider.name
  };

  // payload called by provider.uploadMap
  const payload = {
    mapData,
    options
  };
  const uploadFileTask = EXPORT_FILE_TO_CLOUD_TASK({ provider, payload }).bimap(
    // success
    response => exportFileSuccess({ response, provider, options, onSuccess, closeModal }),
    // error
    error => exportFileError({ error, provider, options, onError })
  );

  return withTask(newState, uploadFileTask);
};

/**
 *
 * @type {typeof import('./provider-state-updaters').exportFileSuccessUpdater}
 */
export const exportFileSuccessUpdater = (state, action) => {
  const { response, provider, options = {}, onSuccess, closeModal } = action.payload;

  const newState = {
    ...state,
    isProviderLoading: false,
    // TODO: do we always have to store this?
    successInfo: response,
    ...(!options.isPublic
      ? {
        mapSaved: provider.name
      }
      : {})
  };

  const tasks = [
    createActionTask(onSuccess, { response, provider, options }),
    closeModal &&
    ACTION_TASK().map(_ => postSaveLoadSuccess(`Map saved to ${state.currentProvider}!`))
  ].filter(d => d);

  return tasks.length ? withTask(newState, tasks) : newState;
};

/**
 * Close modal on success and display notification
 * @type {typeof import('./provider-state-updaters').postSaveLoadSuccessUpdater}
 */
export const postSaveLoadSuccessUpdater = (state, action) => {
  const message = action.payload || `Saved / Load to ${state.currentProvider} Success`;

  const tasks = [
    ACTION_TASK().map(_ => toggleModal(null)),
    ACTION_TASK().map(_ => resetProviderStatus()),
    ...createGlobalNotificationTasks({ message })
  ];

  return withTask(state, tasks);
};

/**
 *
 * @type {typeof import('./provider-state-updaters').exportFileErrorUpdater}
 */
export const exportFileErrorUpdater = (state, action) => {
  const { error, provider, onError } = action.payload;

  const newState = {
    ...state,
    isProviderLoading: false
  };

  if (isFileConflict(error)) {
    newState.mapSaved = provider.name;
    return withTask(newState, [ACTION_TASK().map(_ => toggleModal(OVERWRITE_MAP_ID))]);
  }

  newState.providerError = getError(error);
  const task = createActionTask(onError, { error, provider });

  return task ? withTask(newState, task) : newState;
};

export const loadCloudMapUpdater = (state, action) => {
  const { loadParams, provider, onSuccess, onError } = action.payload;
  if (!loadParams) {
    Console.warn('load map error: loadParams is undefined');
    return state;
  }
  if (!_validateProvider(provider, 'downloadMap')) {
    return state;
  }

  const newState = {
    ...state,
    isProviderLoading: true,
    isCloudMapLoading: true
  };

  // payload called by provider.downloadMap
  const uploadFileTask = LOAD_CLOUD_MAP_TASK({ provider, payload: loadParams }).bimap(
    // success
    response => loadCloudMapSuccess({ response, loadParams, provider, onSuccess, onError }),
    // error
    error => loadCloudMapError({ error, provider, onError })
  );

  return withTask(newState, uploadFileTask);
};

function isFileConflict(error) {
  return error && error.message === FILE_CONFLICT_MSG;
}

function checkLoadMapResponseError(response) {
  if (!response || !isPlainObject(response)) {
    return new Error('Load map response is empty');
  }
  if (!isPlainObject(response.map)) {
    return new Error(`Load map response should be an object property "map"`);
  }
  if (!response.map.datasets || !response.map.config) {
    return new Error(`Load map response.map should be an object with property datasets or config`);
  }

  return null;
}

function getDatasetHandler(format) {
  const defaultHandler = DATASET_HANDLERS[DATASET_FORMATS.csv];
  if (!format) {
    Console.warn('format is not provided in load map response, will use csv by default');
    return defaultHandler;
  }

  if (!DATASET_HANDLERS[format]) {
    const supportedFormat = Object.keys(DATASET_FORMATS)
      .map(k => `'${k}'`)
      .join(', ');
    Console.warn(
      `unknown format ${format}. Please use one of ${supportedFormat}, will use csv by default`
    );
    return defaultHandler;
  }

  return DATASET_HANDLERS[format];
}

function parseLoadMapResponse(response, loadParams, provider) {
  const { map, format } = response;
  const processorMethod = getDatasetHandler(format);

  const parsedDatasets = toArray(map.datasets).map((ds, i) => {
    if (format === DATASET_FORMATS.keplergl) {
      // no need to obtain id, directly pass them in
      return processorMethod(ds);
    }
    const info = (ds && ds.info) || { id: generateHashId(6) };
    const data = processorMethod(ds.data || ds);
    return { info, data };
  });

  const info = {
    ...map.info,
    provider: provider.name,
    loadParams
  };
  return {
    datasets: parsedDatasets,
    info,
    ...(map.config ? { config: map.config } : {})
  };
}

/**
 *
 * @type {typeof import('./provider-state-updaters').loadCloudMapSuccessUpdater}
 */
export const loadCloudMapSuccessUpdater = (state, action) => {
  const { response, loadParams, provider, onSuccess, onError } = action.payload;

  const formatError = checkLoadMapResponseError(response);
  if (formatError) {
    // if response format is not correct
    return exportFileErrorUpdater(state, {
      payload: { error: formatError, provider, onError }
    });
  }

  const newState = {
    ...state,
    mapSaved: provider.name,
    currentProvider: provider.name,
    isCloudMapLoading: false,
    isProviderLoading: false
  };

  const payload = parseLoadMapResponse(response, loadParams, provider);

  const tasks = [
    ACTION_TASK().map(_ => addDataToMap(payload)),
    createActionTask(onSuccess, { response, loadParams, provider }),
    ACTION_TASK().map(_ => postSaveLoadSuccess(`Map from ${provider.name} loaded`))
  ].filter(d => d);

  return tasks.length ? withTask(newState, tasks) : newState;
};

/**
 *
 * @type {typeof import('./provider-state-updaters').loadCloudMapErrorUpdater}
 */
export const loadCloudMapErrorUpdater = (state, action) => {
  const message = getError(action.payload.error) || `Error loading saved map`;

  Console.warn(message);

  const newState = {
    ...state,
    isProviderLoading: false,
    isCloudMapLoading: false,
    providerError: null
  };

  return withTask(
    newState,
    createGlobalNotificationTasks({ type: 'error', message, delayClose: false })
  );
};

/**
 *
 * @type {typeof import('./provider-state-updaters').resetProviderStatusUpdater}
 */
export const resetProviderStatusUpdater = (state, action) => ({
  ...state,
  isProviderLoading: false,
  providerError: null,
  isCloudMapLoading: false,
  successInfo: {}
});

/**
 * Set current cloudProvider
 * @type {typeof import('./provider-state-updaters').setCloudProviderUpdater}
 */
export const setCloudProviderUpdater = (state, action) => ({
  ...state,
  isProviderLoading: false,
  providerError: null,
  successInfo: {},
  currentProvider: action.payload
});

/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsUpdater}
 */
export const getSavedMapsUpdater = (state, action) => {
  const provider = action.payload;
  if (!_validateProvider(provider, 'listMaps')) {
    return state;
  }

  const getSavedMapsTask = GET_SAVED_MAPS_TASK(provider).bimap(
    // success
    visualizations => getSavedMapsSuccess({ visualizations, provider }),
    // error
    error => getSavedMapsError({ error, provider })
  );

  return withTask(
    {
      ...state,
      isProviderLoading: true
    },
    getSavedMapsTask
  );
};

/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsSuccessUpdater}
 */
export const getSavedMapsSuccessUpdater = (state, action) => ({
  ...state,
  isProviderLoading: false,
  visualizations: action.payload.visualizations
});

/**
 *
 * @type {typeof import('./provider-state-updaters').getSavedMapsErrorUpdater}
 */
export const getSavedMapsErrorUpdater = (state, action) => {
  const message =
    getError(action.payload.error) || `Error getting saved maps from ${state.currentProvider}`;

  Console.warn(action.payload.error);

  const newState = {
    ...state,
    currentProvider: null,
    isProviderLoading: false
  };

  return withTask(
    newState,
    createGlobalNotificationTasks({ type: 'error', message, delayClose: false })
  );
};

export const setDatasetLabelUpdater = (state, { payload: label }) => {

  return {
    ...state,
    datasetLabel: label,
    labelError: label ? null : state.labelError
  };
};

function checkSessionId(query) {
  const gquery = gql`${query}`;
  const documentNode = gquery.definitions?.[0];
  const fieldNode = documentNode.selectionSet.selections?.[0];
  const fields = fieldNode.selectionSet?.selections;
  return fields && fields.filter(f => f.name.value == 'session_id').length > 0;
}

export const setQueryUpdater = (state, { payload: query }) => {
  let isAvailableSessionId = false;
  const newState = {
    ...state,
    query,
    queryError: null,
    queryTestResult: null,
    queryTestError: null,
    queryTestTime: 0,
    isAvailableSessionId: false,
  };

  try {
    isAvailableSessionId = checkSessionId(query);
  }
  catch (e) {
    return {
      ...newState,
      queryError: e.message,
    };
  }

  return {
    ...newState,
    isAvailableSessionId,
  };
};

export const setSessionCheckedUpdater = (state, { payload: checked }) => {
  const newState = {
    ...state,
    isCheckedSession: checked,
    isExpandedQuery: !checked,
    isExpandedSession: checked,
  };

  if (checked) {
    if (state.queryError || state.query == '') {
      return {
        ...state,
        queryError: 'Please complete query without errors.'
      };
    }
    else if (!state.isAvailableSessionId) {
      return {
        ...state,
        queryError: "Current query doesn't contain session_id field. In order to choose sessions, please insert session_id field if exists."
      };
    }
    else if (!state.queryTestResult) {
      return withTask(newState, createActionTask(testQuery, { nextAction: loadSession }));
    }
    else {
      return withTask(newState, createActionTask(loadSession, null));
    }
  }

  return newState;
};

export const setQueryExpandedUpdater = (state, { payload: expanded }) => {
  return {
    ...state,
    isExpandedQuery: expanded,
    isExpandedSession: expanded ? false : state.isExpandedSession
  };
};

export const setSessionExpandedUpdater = (state, { payload: expanded }) => {
  const newState = {
    ...state,
    isExpandedSession: expanded,
    isExpandedQuery: expanded ? false : state.isExpandedQuery
  };

  if (expanded && !state.queryTestResult) {
    return withTask(newState, createActionTask(testQuery, { nextAction: loadSession }));
  }

  return newState;
};

export const selectSessionUpdater = (state, { payload: id }) => {
  return {
    ...state,
    sessions: state.sessions.map(s => s.id == id ? { ...s, selected: !s.selected } : s)
  };
};

export const loadSessionUpdater = (state) => {
  let sessions = [];
  const groups = _.groupBy(state.queryTestResult, 'session_id');

  for (let id in groups) {
    const group = groups[id];
    const startDate = moment(_.minBy(group, o => moment(o.date).valueOf()).date).format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(_.maxBy(group, o => moment(o.date).valueOf()).date).format('YYYY-MM-DD HH:mm:ss');
    const count = group.length;
    sessions.push({ id, startDate, endDate, count, selected: false });
  }

  sessions = _.orderBy(sessions, o => parseInt(o.id), 'desc');

  return {
    ...state,
    sessions
  };
};

export const reloadSessionUpdater = (state) => {
  const newState = {
    ...state,
    isExpandedSession: true,
    isExpandedQuery: false
  };

  if (state.queryTestResult) {
    return loadSessionUpdater(state);
  }

  return withTask(newState, createActionTask(testQuery, { nextAction: loadSession }));
};

export const testQueryUpdater = (state, { payload: { nextAction, payload } }) => {
  const query = gql`${state.query}`;
  const documentNode = query.definitions?.[0];
  const fieldNode = documentNode.selectionSet.selections?.[0];
  const startTime = new Date();
  const queryTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
    res => {
      const endTime = new Date();
      const queryTestTime = endTime - startTime;
      return testQuerySuccess({ data: res.data[fieldNode.name.value], nextAction, payload, queryTestTime })
    },
    err => testQueryError(err)
  );
  const newState = { ...state, isLoadingSession: true };

  return withTask(newState, queryTask);
};

export const testQuerySuccessUpdater = (state, { payload: { data, nextAction, payload, queryTestTime } }) => {
  const newState = {
    ...state,
    isLoadingSession: false,
    queryTestResult: data,
    queryTestTime,
    queryTestError: null
  };

  const tasks = [
    nextAction && createActionTask(nextAction, payload),
    createActionTask(loadSession, null)
  ].filter(d => d);

  return withTask(newState, tasks);
};

export const testQueryErrorUpdater = (state, { payload: error }) => {
  return {
    ...state,
    isLoadingSession: false,
    queryTestError: error.message,
    queryTestResult: null
  };
};

export const addDatasetUpdater = (state, { payload: { selectedSessions, updating, oldDataset } }) => {
  if (state.datasetLabel == '') {
    return {
      ...state,
      labelError: 'Please fill the dataset label'
    };
  }

  if (state.queryError || !state.query) {
    return {
      ...state,
      queryError: 'Please complete query without errors'
    }
  }

  if (!state.queryTestResult && (!updating || updating && (oldDataset.query != state.query))) {
    return {
      ...state,
      queryTestError: 'Please run the query successfully'
    }
  }

  let map = {
    options: {
      autoCreateLayers: false
    }
  };

  if (updating) {
    map = {
      ...map,
      datasets: {
        info: {
          id: oldDataset.id,
          label: state.datasetLabel,
          query: state.query,
          type: oldDataset.type,
          color: oldDataset.color,
          enabled: oldDataset.enabled,
        }
      }
    };
  }
  else {
    map = {
      ...map,
      datasets: {
        info: {
          type: DATASET_TYPES.database,
          label: state.datasetLabel,
          id: generateHashId(),
          query: state.query,
          sessions: selectedSessions,
          enabled: true,
        }
      }
    };
  }

  if (updating && oldDataset.query == state.query) {
    map.datasets.info.sessions = oldDataset.sessions;
    map.datasets.data = {
      fields: oldDataset.fields,
      rows: oldDataset.allData
    }
  }
  else {
    const gquery = gql`${state.query}`;
    const documentNode = gquery.definitions?.[0];
    const fieldNode = documentNode.selectionSet.selections?.[0];
    const order = fieldNode.selectionSet?.selections.map(f => f.name.value);
    const data = state.isCheckedSession ? state.queryTestResult.filter(o => selectedSessions.findIndex(id => id == o.session_id) >= 0) : state.queryTestResult;
    const fields = getFieldsFromData(data, order);
    const rows = new Array;

    data.forEach(item => rows.push(order.map(field => item[field])));
    map.datasets.info.sessions = selectedSessions;
    map.datasets.data = { fields, rows };
  }

  const tasks = [
    createActionTask(addDataToMap, map),
    createActionTask(updating ? updateDataset : registerDataset, map.datasets.info)
  ];
  const newState = {
    ...state,
    ...INITIAL_SESSION_STATE
  };

  return withTask(newState, tasks);
};

export const registerDatasetUpdater = (state, { payload: info }) => {
  const mutation = GQL_INSERT_DATASET();
  const insertDatasetTask = GRAPHQL_MUTATION_TASK({
    variables: info,
    mutation
  }).bimap(
    res => registerDatasetSuccess(info),
    err => registerDatasetError(err)
  );
  const newState = { ...state, isRegistering: true };

  return withTask(newState, insertDatasetTask);
};

export const registerDatasetSuccessUpdater = (state, { payload: info }) => {
  return {
    ...state,
    isRegistering: false
  };
};

export const registerDatasetErrorUpdater = (state, { payload: info }) => {
  return {
    ...state,
    isRegistering: false
  };
};


export const updateDatasetUpdater = (state, { payload: info }) => {
  const mutation = GQL_UPDATE_DATASET();
  const updateDatasetTask = GRAPHQL_MUTATION_TASK({
    variables: info,
    mutation
  }).bimap(
    res => updateDatasetSuccess(info),
    err => updateDatasetError(err)
  );
  const newState = { ...state, isUpdateing: true };

  return withTask(newState, updateDatasetTask);
};

export const updateDatasetSuccessUpdater = (state, { payload: info }) => {
  return {
    ...state,
    isUpdateing: false
  };
};

export const updateDatasetErrorUpdater = (state, { payload: info }) => {
  return {
    ...state,
    isUpdateing: false
  };
};

export const loadDatasetUpdater = (state) => {
  const query = GQL_GET_DATASETS();
  const loadDatasetTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
    result => loadDatasetSuccess(result.data.signal_db_datasets),
    error => loadDatasetError(error)
  );
  const newState = {
    ...state,
    isLoadingDataset: true
  };

  return withTask(newState, loadDatasetTask);
};

export const loadDatasetSuccessUpdater = (state, { payload: datasets }) => {
  let loadedCount = 0;

  const tasks = datasets.map(dataset => {
    const query = gql`${dataset.query}`;
    const queryTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
      result => {
        loadedCount ++;

        const documentNode = query.definitions?.[0];
        const fieldNode = documentNode.selectionSet.selections?.[0];
        const order = fieldNode.selectionSet?.selections.map(f => f.name.value);
        const data = result.data[fieldNode.name.value];
        const filteredData = dataset.sessions.length ? data.filter(o => dataset.sessions.findIndex(id => id == o.session_id) >= 0) : data;
        const fields = getFieldsFromData(filteredData, order);
        const rows = new Array;

        data.forEach(item => rows.push(order.map(field => item[field])));

        const map = {
          datasets: {
            info: {...dataset, loadingCompleted: loadedCount == datasets.length },
            data: { fields, rows }
          },
          options: {
            autoCreateLayers: false
          }
        };
        
        return addDataToMap(map);
      },
      error => loadDatasetError(error)
    );
    return queryTask;
  });

  const newState = { ...state, isLoadingDataset: false };

  return withTask(newState, tasks);
};

export const loadDatasetErrorUpdater = (state, { payload: error }) => {
  return {
    ...state,
    isLoadingDataset: false
  };
};

export const initDatasetUpdater = (state, { payload: oldDataset }) => {
  const { query, sessions, label } = oldDataset;

  return {
    ...state,
    ...INITIAL_SESSION_STATE,
    query,
    datasetLabel: label,
    selectedSessions: sessions,
    isCheckedSession: sessions.length > 0,
    isAvailableSessionId: checkSessionId(query)
  };
};