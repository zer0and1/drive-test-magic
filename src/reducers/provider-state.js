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

import {handleActions} from 'redux-actions';
import * as providerStateUpdaters from './provider-state-updaters';
import {ActionTypes} from 'actions/provider-actions';

/**
 * Important: Do not rename `actionHandler` or the assignment pattern of property value.
 * It is used to generate documentation
 */
const actionHandler = {
  [ActionTypes.EXPORT_FILE_TO_CLOUD]: providerStateUpdaters.exportFileToCloudUpdater,
  [ActionTypes.EXPORT_FILE_SUCCESS]: providerStateUpdaters.exportFileSuccessUpdater,
  [ActionTypes.EXPORT_FILE_ERROR]: providerStateUpdaters.exportFileErrorUpdater,
  [ActionTypes.RESET_PROVIDER_STATUS]: providerStateUpdaters.resetProviderStatusUpdater,
  [ActionTypes.SET_CLOUD_PROVIDER]: providerStateUpdaters.setCloudProviderUpdater,
  [ActionTypes.POST_SAVE_LOAD_SUCCESS]: providerStateUpdaters.postSaveLoadSuccessUpdater,
  [ActionTypes.LOAD_CLOUD_MAP]: providerStateUpdaters.loadCloudMapUpdater,
  [ActionTypes.LOAD_CLOUD_MAP_SUCCESS]: providerStateUpdaters.loadCloudMapSuccessUpdater,
  [ActionTypes.LOAD_CLOUD_MAP_ERROR]: providerStateUpdaters.loadCloudMapErrorUpdater,
  [ActionTypes.GET_SAVED_MAPS]: providerStateUpdaters.getSavedMapsUpdater,
  [ActionTypes.GET_SAVED_MAPS_SUCCESS]: providerStateUpdaters.getSavedMapsSuccessUpdater,
  [ActionTypes.GET_SAVED_MAPS_ERROR]: providerStateUpdaters.getSavedMapsErrorUpdater,
  [ActionTypes.SET_DATASET_LABEL]: providerStateUpdaters.setDatasetLabelUpdater,
  [ActionTypes.SET_QUERY]: providerStateUpdaters.setQueryUpdater,
  [ActionTypes.SET_SESSION_CHECKED]: providerStateUpdaters.setSessionCheckedUpdater,
  [ActionTypes.SET_QUERY_EXPANDED]: providerStateUpdaters.setQueryExpandedUpdater,
  [ActionTypes.SET_SESSION_EXPANDED]: providerStateUpdaters.setSessionExpandedUpdater,
  [ActionTypes.LOAD_SESSION]: providerStateUpdaters.loadSessionUpdater,
  [ActionTypes.RELOAD_SESSION]: providerStateUpdaters.reloadSessionUpdater,
  [ActionTypes.SELECT_SESSION]: providerStateUpdaters.selectSessionUpdater,
  [ActionTypes.TEST_QUERY]: providerStateUpdaters.testQueryUpdater,
  [ActionTypes.TEST_QUERY_SUCCESS]: providerStateUpdaters.testQuerySuccessUpdater,
  [ActionTypes.TEST_QUERY_ERROR]: providerStateUpdaters.testQueryErrorUpdater,
  [ActionTypes.ADD_DATASET]: providerStateUpdaters.addDatasetUpdater,
  [ActionTypes.REGISTER_DATASET]: providerStateUpdaters.registerDatasetUpdater,
  [ActionTypes.REGISTER_DATASET_SUCCESS]: providerStateUpdaters.registerDatasetSuccessUpdater,
  [ActionTypes.REGISTER_DATASET_ERROR]: providerStateUpdaters.registerDatasetErrorUpdater,
  [ActionTypes.UPDATE_DATASET]: providerStateUpdaters.updateDatasetUpdater,
  [ActionTypes.UPDATE_DATASET_SUCCESS]: providerStateUpdaters.updateDatasetSuccessUpdater,
  [ActionTypes.UPDATE_DATASET_ERROR]: providerStateUpdaters.updateDatasetErrorUpdater,
  [ActionTypes.LOAD_DATASET]: providerStateUpdaters.loadDatasetUpdater,
  [ActionTypes.LOAD_DATASET_SUCCESS]: providerStateUpdaters.loadDatasetSuccessUpdater,
  [ActionTypes.LOAD_DATASET_ERROR]: providerStateUpdaters.loadDatasetErrorUpdater,
  [ActionTypes.INIT_DATASET]: providerStateUpdaters.initDatasetUpdater,
};

// construct provider-state reducer
export const providerStateReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {
    ...providerStateUpdaters.INITIAL_PROVIDER_STATE,
    ...initialState,
    initialState
  });

export default providerStateReducerFactory();
