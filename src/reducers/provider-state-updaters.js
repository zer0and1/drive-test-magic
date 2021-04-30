// Copyright (c) 2021 Uber Technologies, Inc.
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

import {withTask} from 'react-palm/tasks';
import {default as Console} from 'global/console';
import {generateHashId, getError, isPlainObject} from 'utils/utils';
import {
  EXPORT_FILE_TO_CLOUD_TASK,
  ACTION_TASK,
  DELAY_TASK,
  LOAD_CLOUD_MAP_TASK,
  GET_SAVED_MAPS_TASK,
  GRAPHQL_QUERY_TASK,
  GRAPHQL_MUTATION_TASK
} from 'tasks/tasks';
import {removeNotification, toggleModal, addNotification} from 'actions/ui-state-actions';
import {addDataToMap} from 'actions/actions';
import {
  DEFAULT_NOTIFICATION_TYPES,
  DEFAULT_NOTIFICATION_TOPICS,
  DATASET_FORMATS,
  DATASET_TYPES,
  OVERWRITE_MAP_ID
} from 'constants/default-settings';
import {toArray} from 'utils/utils';
import {FILE_CONFLICT_MSG} from 'cloud-providers';
import {DATASET_HANDLERS} from 'processors/data-processor';
import {gql} from '@apollo/client';
import {
  GQL_INSERT_DATASET,
  GQL_GET_DATASETS,
  GQL_UPDATE_DATASET,
  GQL_DELETE_DATASET,
  GQL_GET_SESSIONS
} from 'graphqls';

import {
  exportFileSuccess,
  exportFileError,
  postSaveLoadSuccess,
  loadCloudMapSuccess,
  getSavedMapsSuccess,
  getSavedMapsError,
  loadCloudMapError,
  resetProviderStatus,

  testQuerySuccess,
  testQueryError,
  loadSession,
  loadSessionSuccess,
  loadSessionError,
  registerDataset,
  registerDatasetSuccess,
  registerDatasetError,
  unregisterDatasetSuccess,
  unregisterDatasetError,
  updateDatasetSuccess,
  updateDatasetError,
  loadDatasetSuccess,
  loadDatasetError,
} from 'actions/provider-actions';
import {startReloadingDataset} from 'actions/vis-state-actions';

import _ from 'lodash';
import moment from 'moment';
import {
  extractFields,
  extractOperation,
  restrictSession,
  makeDataset
} from '../utils/gql-utils';

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
  isTestingQuery: false,
  isAvailableSessionId: false,
  isRegistering: false,
  isUnregistering: false,
  isUpdating: false,
  isLoadingDataset: false,
  sessionIds: []
};

export const INITIAL_PROVIDER_STATE = {
  isProviderLoading: false,
  isCloudMapLoading: false,
  providerError: null,
  currentProvider: null,
  successInfo: {},
  mapSaved: null,
  visualizations: [],
  dataset: null,
  collections: {},
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
function createGlobalNotificationTasks({type, message, delayClose = true}) {
  const id = generateHashId();
  const successNote = {
    id,
    type: DEFAULT_NOTIFICATION_TYPES[type || ''] || DEFAULT_NOTIFICATION_TYPES.success,
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
  const {mapData, provider, options = {}, onSuccess, onError, closeModal} = action.payload;

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
  const uploadFileTask = EXPORT_FILE_TO_CLOUD_TASK({provider, payload}).bimap(
    // success
    response => exportFileSuccess({response, provider, options, onSuccess, closeModal}),
    // error
    error => exportFileError({error, provider, options, onError})
  );

  return withTask(newState, uploadFileTask);
};

/**
 *
 * @type {typeof import('./provider-state-updaters').exportFileSuccessUpdater}
 */
export const exportFileSuccessUpdater = (state, action) => {
  const {response, provider, options = {}, onSuccess, closeModal} = action.payload;

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
    createActionTask(onSuccess, {response, provider, options}),
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
    ...createGlobalNotificationTasks({message})
  ];

  return withTask(state, tasks);
};

/**
 *
 * @type {typeof import('./provider-state-updaters').exportFileErrorUpdater}
 */
export const exportFileErrorUpdater = (state, action) => {
  const {error, provider, onError} = action.payload;

  const newState = {
    ...state,
    isProviderLoading: false
  };

  if (isFileConflict(error)) {
    newState.mapSaved = provider.name;
    return withTask(newState, [ACTION_TASK().map(_ => toggleModal(OVERWRITE_MAP_ID))]);
  }

  newState.providerError = getError(error);
  const task = createActionTask(onError, {error, provider});

  return task ? withTask(newState, task) : newState;
};

export const loadCloudMapUpdater = (state, action) => {
  const {loadParams, provider, onSuccess, onError} = action.payload;
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
  const uploadFileTask = LOAD_CLOUD_MAP_TASK({provider, payload: loadParams}).bimap(
    // success
    response => loadCloudMapSuccess({response, loadParams, provider, onSuccess, onError}),
    // error
    error => loadCloudMapError({error, provider, onError})
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
  const {map, format} = response;
  const processorMethod = getDatasetHandler(format);

  const parsedDatasets = toArray(map.datasets).map((ds, i) => {
    if (format === DATASET_FORMATS.keplergl) {
      // no need to obtain id, directly pass them in
      return processorMethod(ds);
    }
    const info = (ds && ds.info) || {id: generateHashId(6)};
    const data = processorMethod(ds.data || ds);
    return {info, data};
  });

  const info = {
    ...map.info,
    provider: provider.name,
    loadParams
  };
  return {
    datasets: parsedDatasets,
    info,
    ...(map.config ? {config: map.config} : {})
  };
}

/**
 *
 * @type {typeof import('./provider-state-updaters').loadCloudMapSuccessUpdater}
 */
export const loadCloudMapSuccessUpdater = (state, action) => {
  const {response, loadParams, provider, onSuccess, onError} = action.payload;

  const formatError = checkLoadMapResponseError(response);
  if (formatError) {
    // if response format is not correct
    return exportFileErrorUpdater(state, {
      payload: {error: formatError, provider, onError}
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
    createActionTask(onSuccess, {response, loadParams, provider}),
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
    createGlobalNotificationTasks({type: 'error', message, delayClose: false})
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
    visualizations => getSavedMapsSuccess({visualizations, provider}),
    // error
    error => getSavedMapsError({error, provider})
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
    createGlobalNotificationTasks({type: 'error', message, delayClose: false})
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
  const fields = extractFields(query);
  return fields && fields.findIndex(f => f == 'session_id') >= 0;
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

export const selectSessionUpdater = (state, { payload: id }) => {
  const sessions = state.sessions.map(s => {
    let selected = false;
    switch(id) {
      case 'all': selected = true; break;
      case 'none': selected = false; break;
      case s.id: selected = !s.selected; break;
      default: selected = s.selected;
    }
    return {...s, selected};
  });

  return {
    ...state,
    sessionIds: sessions.filter(s => s.selected).map(s => s.id),
    sessions
  };
};

export const loadSessionUpdater = (state) => {
  const query = GQL_GET_SESSIONS();
  const task = GRAPHQL_QUERY_TASK({query, fetchPolicy: 'network-only'}).bimap(
    res => loadSessionSuccess(res.data.signal_db_sessions_view),
    err => loadSessionError(err)
  );
  const newState = {
    ...state,
    isLoadingSession: true
  };

  return withTask(newState, task);
};

export const loadSessionSuccessUpdater = (state, {sessions}) => ({
  ...state,
  isLoadingSession: false,
  sessions: sessions.map(s => ({
    ...s,
    start_date: moment(s.start_date).format('YYYY-MM-DD HH:mm:ss'),
    end_date: moment(s.end_date).format('YYYY-MM-DD HH:mm:ss'),
    selected: state.sessionIds.findIndex(sid => sid == s.id) >= 0
  }))
});

export const loadSessionErrorUpdater = (state, {error}) => ({
  ...state,
  isLoadingSession: false,
  error
});

export const testQueryUpdater = (state, { payload: { nextAction, payload } }) => {
  const query = gql(restrictSession(state.query, state.sessionIds));
  const startTime = new Date();
  const queryTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
    res => {
      const endTime = new Date();
      const queryTestTime = endTime - startTime;
      return testQuerySuccess({ data: res.data[extractOperation(query)], nextAction, payload, queryTestTime })
    },
    err => testQueryError(err)
  );
  const newState = {
    ...state,
    isTestingQuery: true
  };

  return withTask(newState, queryTask);
};

export const testQuerySuccessUpdater = (state, { payload: { data, nextAction, payload, queryTestTime } }) => {
  const newState = {
    ...state,
    isTestingQuery: false,
    queryTestResult: data,
    queryTestTime,
    queryTestError: null
  };

  const task = [
    nextAction && createActionTask(nextAction, payload)
  ].filter(d => d);

  return withTask(newState, task);
};

export const testQueryErrorUpdater = (state, { payload: error }) => {
  return {
    ...state,
    isTestingQuery: false,
    queryTestError: error.message,
    queryTestResult: null
  };
};

export const addDatasetUpdater = (state) => {
  const {
    query, 
    queryTestResult,
    queryError,
    datasetLabel,
    sessionIds
  } = state;

  if (datasetLabel == '') {
    return {
      ...state,
      labelError: 'Please fill the dataset label'
    };
  }

  if (queryError || !query) {
    return {
      ...state,
      queryError: 'Please complete query without errors'
    }
  }

  if (queryTestResult == null) {
    return {
      ...state,
      queryTestError: 'Please run the query successfully'
    }
  }
  const datasetInfo = {
    type: DATASET_TYPES.database,
    label: datasetLabel,
    id: generateHashId(),
    query: query,
    sessions: sessionIds,
    enabled: true
  };
  const mapInfo = {
    datasets: {
      info: {
        ...datasetInfo,
        timestamp: moment().valueOf()
      },
      data: makeDataset(query, queryTestResult, sessionIds)
    },
    options: {
      autoCreateLayers: false
    }
  };

  const tasks = [
    createActionTask(addDataToMap, mapInfo),
    createActionTask(registerDataset, datasetInfo)
  ].filter(d => d);

  return withTask(state, tasks);
};

export const updateDatasetUpdater = (state) => {
  const {
    query, 
    queryTestResult,
    queryError,
    datasetLabel: label,
    dataset,
    sessionIds
  } = state;

  if (label == '') {
    return {
      ...state,
      labelError: 'Please fill the dataset label'
    };
  }

  if (queryError || !query) {
    return {
      ...state,
      queryError: 'Please complete query without errors'
    }
  }

  if (queryTestResult == null && query != dataset.query) {
    return {
      ...state,
      queryTestError: 'Please run the query successfully'
    }
  }

  const datasetInfo = {
    id: dataset.id,
    enabled: dataset.enabled,
    type: dataset.type,
    query,
    label,
    sessions: [...sessionIds]
  };

  const newState = {
    ...state,
    dataset: {
      ...dataset,
      ...datasetInfo,
      info: {...datasetInfo}
    },
    isUpdating: true
  };
  
  const mutation = GQL_UPDATE_DATASET();
  const updateTask = GRAPHQL_MUTATION_TASK({
    variables: datasetInfo,
    mutation
  }).bimap(
    _ => updateDatasetSuccess(),
    err => updateDatasetError(err)
  );
  const tasks = [
    createActionTask(toggleModal, null),
    createActionTask(startReloadingDataset, newState.dataset),
    updateTask
  ].filter(d => d);


  return withTask(newState, tasks);
};

export const updateDatasetSuccessUpdater = (state) => ({
  ...state,
  isUpdateing: false,
});

export const updateDatasetErrorUpdater = (state) => ({
  ...state,
  isUpdateing: false
});

export const registerDatasetUpdater = (state, { payload: datasetInfo }) => {
  const mutation = GQL_INSERT_DATASET();
  const insertDatasetTask = GRAPHQL_MUTATION_TASK({
    variables: datasetInfo, // {id, type, label, enabled, query, sessions}
    mutation
  }).bimap(
    _ => registerDatasetSuccess(datasetInfo),
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

export const registerDatasetErrorUpdater = (state, { payload: error }) => {
  return {
    ...state,
    error,
    isRegistering: false
  };
};

export const unregisterDatasetUpdater = (state, { payload: id }) => {
  const mutation = GQL_DELETE_DATASET();
  const deleteDatasetTask = GRAPHQL_MUTATION_TASK({
    variables: { id },
    mutation
  }).bimap(
    () => unregisterDatasetSuccess(),
    err => unregisterDatasetError(err)
  );
  const newState = { ...state, isUnregistering: true };

  return withTask(newState, deleteDatasetTask);
};

export const unregisterDatasetSuccessUpdater = (state) => {
  return {
    ...state,
    isUnregistering: false
  };
};

export const unregisterDatasetErrorUpdater = (state, { payload: error }) => {
  return {
    ...state,
    isUnregistering: false,
    error
  };
};

export const loadDatasetUpdater = (state) => {
  const query = GQL_GET_DATASETS();
  const tasks = [
    ACTION_TASK().map(_ => loadSession()),
    GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
      result => loadDatasetSuccess(result.data.signal_db_datasets),
      error => loadDatasetError(error)
    )
  ];
  const newState = {
    ...state,
    isLoadingDataset: true
  };

  return withTask(newState, tasks);
};

export const loadDatasetSuccessUpdater = (state, { payload: datasets }) => {
  let loadedCount = 0;
  const options = {
    autoCreateLayers: false,
    centerMap: false,
    keepExistingConfig: true
  };

  const tasks = datasets.map(dataset => {
    const { sessions, query: qstr, enabled } = dataset;

    if (enabled) {
      const query = gql(restrictSession(qstr, sessions));
      const queryTask = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).bimap(
        result => {
          loadedCount++;
          const timestamp = moment().valueOf();
          const data = result.data[extractOperation(query)];
          const map = {
            datasets: {
              info: { ...dataset, loadingCompleted: loadedCount == datasets.length, timestamp },
              data: makeDataset(query, data, sessions)
            },
            options
          };

          return addDataToMap(map);
        },
        error => loadDatasetError(error)
      );
      return queryTask;
    }
    else {
      loadedCount++;

      return createActionTask(addDataToMap, {
        datasets: {
          info: { ...dataset, loadingCompleted: loadedCount == datasets.length },
          data: { fields: [], rows: [] }
        },
        options
      });
    }
  });

  const newState = { 
    ...state, 
    isLoadingDataset: false,
    loadingCompleted: datasets.length == 0
  };

  return withTask(newState, tasks);
};

export const loadDatasetErrorUpdater = (state, { payload: error }) => {
  return {
    ...state,
    isLoadingDataset: false
  };
};

export const reloadDatasetUpdater = (state, { dataset }) => {
  const { query: qstr, sessions } = dataset;
  const query = gql(restrictSession(qstr, sessions));
  const task = GRAPHQL_QUERY_TASK({ query, fetchPolicy: 'network-only' }).map(
    result => {
      const data = makeDataset(query, result.data[extractOperation(query)], sessions);
      return addDataToMap({
        datasets: {
          info: {
            ...dataset,
            reloading: false,
            timestamp: moment().valueOf()
          },
          data
        },
        options: {
          keepExistingConfig: true,
          centerMap: false,
          autoCreateLayers: false
        }
      });
    }
  );

  return withTask(state, task);
};

export const setDatasetUpdater = (state, {dataset}) => ({
  ...state,
  dataset,
  query: dataset.query,
  datasetLabel: dataset.label,
  queryTestResult: null,
  queryError: null,
  queryTestError: null,
  queryTestTime: 0,
  sessions: state.sessions.map(s => ({
    ...s,
    selected: dataset.sessions.find(sid => sid == s.id) ? true : false
  })),
  sessionIds: dataset.sessions,
  isAvailableSessionId: checkSessionId(dataset.query)
});
