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

import {createAction} from 'redux-actions';
import {ACTION_PREFIX} from 'constants/action-types';

/** @type {import('./provider-actions').ProviderActionTypes} */
export const ActionTypes = {
  EXPORT_FILE_TO_CLOUD: `${ACTION_PREFIX}EXPORT_FILE_TO_CLOUD`,
  EXPORT_FILE_SUCCESS: `${ACTION_PREFIX}EXPORT_FILE_SUCCESS`,
  EXPORT_FILE_ERROR: `${ACTION_PREFIX}EXPORT_FILE_ERROR`,
  RESET_PROVIDER_STATUS: `${ACTION_PREFIX}RESET_PROVIDER_STATUS`,
  SET_CLOUD_PROVIDER: `${ACTION_PREFIX}SET_CLOUD_PROVIDER`,
  POST_SAVE_LOAD_SUCCESS: `${ACTION_PREFIX}POST_SAVE_LOAD_SUCCESS`,
  LOAD_CLOUD_MAP: `${ACTION_PREFIX}LOAD_CLOUD_MAP`,
  LOAD_CLOUD_MAP_SUCCESS: `${ACTION_PREFIX}LOAD_CLOUD_MAP_SUCCESS`,
  LOAD_CLOUD_MAP_ERROR: `${ACTION_PREFIX}LOAD_CLOUD_MAP_ERROR`,
  GET_SAVED_MAPS: `${ACTION_PREFIX}GET_SAVED_MAPS`,
  GET_SAVED_MAPS_SUCCESS: `${ACTION_PREFIX}GET_SAVED_MAPS_SUCCESS`,
  GET_SAVED_MAPS_ERROR: `${ACTION_PREFIX}GET_SAVED_MAPS_ERROR`,
  SET_DATASET_LABEL: `${ACTION_PREFIX}SET_DATASET_LABEL`,
  SET_QUERY: `${ACTION_PREFIX}SET_QUERY`,
  SET_SESSION_CHECKED: `${ACTION_PREFIX}SET_SESSION_CHECKED`,
  SET_QUERY_EXPANDED: `${ACTION_PREFIX}SET_QUERY_EXPANDED`,
  SET_SESSION_EXPANDED: `${ACTION_PREFIX}SET_SESSION_EXPANDED`,
  LOAD_SESSION: `${ACTION_PREFIX}LOAD_SESSION`,
  RELOAD_SESSION: `${ACTION_PREFIX}RELOAD_SESSION`,
  SELECT_SESSION: `${ACTION_PREFIX}SELECT_SESSION`,
  TEST_QUERY: `${ACTION_PREFIX}TEST_QUERY`,
  TEST_QUERY_SUCCESS: `${ACTION_PREFIX}TEST_QUERY_SUCCESS`,
  TEST_QUERY_ERROR: `${ACTION_PREFIX}TEST_QUERY_ERROR`,
  ADD_DATASET: `${ACTION_PREFIX}ADD_DATASET`,
  REGISTER_DATASET: `${ACTION_PREFIX}REGISTER_DATASET`,
  REGISTER_DATASET_SUCCESS: `${ACTION_PREFIX}REGISTER_DATASET_SUCCESS`,
  REGISTER_DATASET_ERROR: `${ACTION_PREFIX}REGISTER_DATASET_ERROR`,
  UNREGISTER_DATASET: `${ACTION_PREFIX}UNREGISTER_DATASET`,
  UNREGISTER_DATASET_SUCCESS: `${ACTION_PREFIX}UNREGISTER_DATASET_SUCCESS`,
  UNREGISTER_DATASET_ERROR: `${ACTION_PREFIX}UNREGISTER_DATASET_ERROR`,
  UPDATE_DATASET: `${ACTION_PREFIX}UPDATE_DATASET`,
  UPDATE_DATASET_SUCCESS: `${ACTION_PREFIX}UPDATE_DATASET_SUCCESS`,
  UPDATE_DATASET_ERROR: `${ACTION_PREFIX}UPDATE_DATASET_ERROR`,
  LOAD_DATASET: `${ACTION_PREFIX}LOAD_DATASET`,
  LOAD_DATASET_SUCCESS: `${ACTION_PREFIX}LOAD_DATASET_SUCCESS`,
  LOAD_DATASET_ERROR: `${ACTION_PREFIX}LOAD_DATASET_ERROR`,
  INIT_DATASET: `${ACTION_PREFIX}INIT_DATASET`,
  RELOAD_DATASET: `${ACTION_PREFIX}RELOAD_DATASET`,
};

/**
 * Call provider to upload file to cloud
 * @param mapData
 * @param provider
 * @param options
 * @param onSuccess
 * @param onError
 * @param closeModal
 * @type {typeof import('./provider-actions').exportFileToCloud}
 */
export const exportFileToCloud = createAction(ActionTypes.EXPORT_FILE_TO_CLOUD, payload => payload);

/**
 * @type {typeof import('./provider-actions').exportFileSuccess}
 */
export const exportFileSuccess = createAction(ActionTypes.EXPORT_FILE_SUCCESS, payload => payload);

/** @type {typeof import('./provider-actions').exportFileError} */
export const exportFileError = createAction(ActionTypes.EXPORT_FILE_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').postSaveLoadSuccess} */
export const postSaveLoadSuccess = createAction(
  ActionTypes.POST_SAVE_LOAD_SUCCESS,
  message => message
);

/** @type {typeof import('./provider-actions').resetProviderStatus} */
export const resetProviderStatus = createAction(ActionTypes.RESET_PROVIDER_STATUS);

/** @type {typeof import('./provider-actions').setCloudProvider} */
export const setCloudProvider = createAction(ActionTypes.SET_CLOUD_PROVIDER, provider => provider);

/** @type {typeof import('./provider-actions').loadCloudMap} */
export const loadCloudMap = createAction(ActionTypes.LOAD_CLOUD_MAP, payload => payload);

/** @type {typeof import('./provider-actions').loadCloudMapSuccess} */
export const loadCloudMapSuccess = createAction(
  ActionTypes.LOAD_CLOUD_MAP_SUCCESS,
  payload => payload
);

/** @type {typeof import('./provider-actions').loadCloudMapError} */
export const loadCloudMapError = createAction(ActionTypes.LOAD_CLOUD_MAP_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').getSavedMaps} */
export const getSavedMaps = createAction(ActionTypes.GET_SAVED_MAPS, provider => provider);

/** @type {typeof import('./provider-actions').getSavedMapsSuccess} */
export const getSavedMapsSuccess = createAction(
  ActionTypes.GET_SAVED_MAPS_SUCCESS,
  payload => payload
);

/** @type {typeof import('./provider-actions').getSavedMapsError} */
export const getSavedMapsError = createAction(ActionTypes.GET_SAVED_MAPS_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').setDatasetLabel} */
export const setDatasetLabel = createAction(ActionTypes.SET_DATASET_LABEL, label => label);

/** @type {typeof import('./provider-actions').setQuery} */
export const setQuery = createAction(ActionTypes.SET_QUERY, query => query);

/** @type {typeof import('./provider-actions').setSessionChecked} */
export const setSessionChecked = createAction(ActionTypes.SET_SESSION_CHECKED, checked => checked);

/** @type {typeof import('./provider-actions').setQueryExpanded} */
export const setQueryExpanded = createAction(ActionTypes.SET_QUERY_EXPANDED, expanded => expanded);

/** @type {typeof import('./provider-actions').setSessionExpanded} */
export const setSessionExpanded = createAction(ActionTypes.SET_SESSION_EXPANDED, expanded => expanded);

/** @type {typeof import('./provider-actions').loadSession} */
export const loadSession = createAction(ActionTypes.LOAD_SESSION);

/** @type {typeof import('./provider-actions').reloadSession} */
export const reloadSession = createAction(ActionTypes.RELOAD_SESSION);

/** @type {typeof import('./provider-actions').selectSession} */
export const selectSession = createAction(ActionTypes.SELECT_SESSION, id => id);

/** @type {typeof import('./provider-actions').testQuery} */
export const testQuery = createAction(ActionTypes.TEST_QUERY, payload => payload ? payload : {});

/** @type {typeof import('./provider-actions').testQuerySuccess} */
export const testQuerySuccess = createAction(ActionTypes.TEST_QUERY_SUCCESS, sessions => sessions);

/** @type {typeof import('./provider-actions').testQueryError} */
export const testQueryError = createAction(ActionTypes.TEST_QUERY_ERROR, error => error);

/** @type {typeof import('./provider-actions').addDataset} */
export const addDataset = createAction(ActionTypes.ADD_DATASET, payload => payload);

/** @type {typeof import('./provider-actions').registerDataset} */
export const registerDataset = createAction(ActionTypes.REGISTER_DATASET, payload => payload);

/** @type {typeof import('./provider-actions').registerDatasetSuccess} */
export const registerDatasetSuccess = createAction(ActionTypes.REGISTER_DATASET_SUCCESS, payload => payload);

/** @type {typeof import('./provider-actions').registerDatasetError} */
export const registerDatasetError = createAction(ActionTypes.REGISTER_DATASET_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').registerDataset} */
export const unregisterDataset = createAction(ActionTypes.UNREGISTER_DATASET, payload => payload);

/** @type {typeof import('./provider-actions').unregisterDatasetSuccess} */
export const unregisterDatasetSuccess = createAction(ActionTypes.UNREGISTER_DATASET_SUCCESS, payload => payload);

/** @type {typeof import('./provider-actions').unregisterDatasetError} */
export const unregisterDatasetError = createAction(ActionTypes.UNREGISTER_DATASET_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').updateDataset} */
export const updateDataset = createAction(ActionTypes.UPDATE_DATASET, payload => payload);

/** @type {typeof import('./provider-actions').updateDatasetSuccess} */
export const updateDatasetSuccess = createAction(ActionTypes.UPDATE_DATASET_SUCCESS, payload => payload);

/** @type {typeof import('./provider-actions').updateDatasetError} */
export const updateDatasetError = createAction(ActionTypes.UPDATE_DATASET_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').loadDataset} */
export const loadDataset = createAction(ActionTypes.LOAD_DATASET, payload => payload);

/** @type {typeof import('./provider-actions').loadDatasetSuccess} */
export const loadDatasetSuccess = createAction(ActionTypes.LOAD_DATASET_SUCCESS, payload => payload);

/** @type {typeof import('./provider-actions').loadDatasetError} */
export const loadDatasetError = createAction(ActionTypes.LOAD_DATASET_ERROR, payload => payload);

/** @type {typeof import('./provider-actions').initDataset} */
export const initDataset = createAction(ActionTypes.INIT_DATASET, payload => payload);

/** @type {typeof import('./provider-actions').reloadDataset} */
export const reloadDataset = (dataset, visState) => ({
  type: ActionTypes.RELOAD_DATASET,
  dataset,
  visState
});


