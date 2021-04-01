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

export const ACTION_PREFIX = '@@kepler.gl/';

/**
 * Kepler.gl action types, can be listened by reducers to perform additional tasks whenever an action is called in kepler.gl
 * @constant
 * @type {Object}
 * @public
 *
 * @example
 * // store.js
 * import {handleActions} from 'redux-actions';
 * import {createStore, combineReducers, applyMiddleware} from 'redux';
 * import {taskMiddleware} from 'react-palm/tasks';
 *
 * import keplerGlReducer from 'kepler.gl/reducers';
 * import {ActionTypes} from 'kepler.gl/actions';
 *
 * const appReducer = handleActions({
 *   // listen on kepler.gl map update action to store a copy of viewport in app state
 *   [ActionTypes.UPDATE_MAP]: (state, action) => ({
 *     ...state,
 *     viewport: action.payload
 *   }),
 * }, {});
 *
 * const reducers = combineReducers({
 *   app: appReducer,
 *   keplerGl: keplerGlReducer
 * });
 *
 * export default createStore(reducers, {}, applyMiddleware(taskMiddleware))
 */
const ActionTypes = {
  // identity action
  REGISTER_ENTRY: `${ACTION_PREFIX}REGISTER_ENTRY`,
  DELETE_ENTRY: `${ACTION_PREFIX}DELETE_ENTRY`,
  RENAME_ENTRY: `${ACTION_PREFIX}RENAME_ENTRY`,

  // authState
  GET_AUTH_INFO: `${ACTION_PREFIX}GET_AUTH_INFO`,
  GET_AUTH_INFO_SUCCESS: `${ACTION_PREFIX}GET_AUTH_INFO_SUCCESS`,
  GET_AUTH_INFO_ERROR: `${ACTION_PREFIX}GET_AUTH_INFO_ERROR`,
  
  // minionState
  SET_LOOPING_ENABLED: `${ACTION_PREFIX}SET_LOOPING_ENABLED`,
  LOAD_MINIONS: `${ACTION_PREFIX}LOAD_MINIONS`,
  LOAD_MINIONS_SUCCESS: `${ACTION_PREFIX}LOAD_MINIONS_SUCCESS`,
  LOAD_MINIONS_ERROR: `${ACTION_PREFIX}LOAD_MINIONS_ERROR`,
  SELECT_MINION: `${ACTION_PREFIX}SELECT_MINION`,
  SET_SLEEP_INTERVAL: `${ACTION_PREFIX}SET_SLEEP_INTERVAL`,
  SET_OPERATION_MODE: `${ACTION_PREFIX}SET_OPERATION_MODE`,
  SET_COMMAND: `${ACTION_PREFIX}SET_COMMAND`,
  SEND_COMMAND: `${ACTION_PREFIX}SEND_COMMAND`,
  SET_SESSION_ID: `${ACTION_PREFIX}SET_SESSION_ID`,
  SEND_SESSION_COMMAND: `${ACTION_PREFIX}SEND_SESSION_COMMAND`,
  SET_MQTT_CLIENT: `${ACTION_PREFIX}SET_MQTT_CLIENT`,
  SET_MQTT_MESSAGE: `${ACTION_PREFIX}SET_MQTT_MESSAGE`,
  LOAD_STATIC_DATA: `${ACTION_PREFIX}LOAD_STATIC_DATA`,
  LOAD_STATIC_DATA_SUCCESS: `${ACTION_PREFIX}LOAD_STATIC_DATA_SUCCESS`,
  SELECT_ALL: `${ACTION_PREFIX}SELECT_ALL`,
  EXPAND: `${ACTION_PREFIX}EXPAND`,
  COLLAPSE: `${ACTION_PREFIX}COLLAPSE`,
  SET_MARKER_SCALE: `${ACTION_PREFIX}SET_MARKER_SCALE`,
  DELETE_FILTERED_DATA: `${ACTION_PREFIX}DELETE_FILTERED_DATA`,
  DELETE_FILTERED_DATA_SUCCESS: `${ACTION_PREFIX}DELETE_FILTERED_DATA_SUCCESS`,
  DELETE_FILTERED_DATA_ERROR: `${ACTION_PREFIX}DELETE_FILTERED_DATA_ERROR`,
  ADD_MINION: `${ACTION_PREFIX}ADD_MINION`,
  ADD_MINION_SUCCESS: `${ACTION_PREFIX}ADD_MINION_SUCCESS`,
  ADD_MINION_ERROR: `${ACTION_PREFIX}ADD_MINION_ERROR`,
  UPDATE_MINION: `${ACTION_PREFIX}UPDATE_MINION`,
  UPDATE_MINION_SUCCESS: `${ACTION_PREFIX}UPDATE_MINION_SUCCESS`,
  UPDATE_MINION_ERROR: `${ACTION_PREFIX}UPDATE_MINION_ERROR`,
  DELETE_MINION: `${ACTION_PREFIX}DELETE_MINION`,
  DELETE_MINION_SUCCESS: `${ACTION_PREFIX}DELETE_MINION_SUCCESS`,
  DELETE_MINION_ERROR: `${ACTION_PREFIX}DELETE_MINION_ERROR`,
  
  // visState
  ADD_DATA: `${ACTION_PREFIX}ADD_DATA`,
  ADD_FILTER: `${ACTION_PREFIX}ADD_FILTER`,
  ADD_LAYER: `${ACTION_PREFIX}ADD_LAYER`,
  DUPLICATE_LAYER: `${ACTION_PREFIX}DUPLICATE_LAYER`,
  INTERACTION_CONFIG_CHANGE: `${ACTION_PREFIX}INTERACTION_CONFIG_CHANGE`,
  LAYER_CONFIG_CHANGE: `${ACTION_PREFIX}LAYER_CONFIG_CHANGE`,
  LAYER_VISUAL_CHANNEL_CHANGE: `${ACTION_PREFIX}LAYER_VISUAL_CHANNEL_CHANGE`,
  LAYER_TYPE_CHANGE: `${ACTION_PREFIX}LAYER_TYPE_CHANGE`,
  LAYER_VIS_CONFIG_CHANGE: `${ACTION_PREFIX}LAYER_VIS_CONFIG_CHANGE`,
  LAYER_TEXT_LABEL_CHANGE: `${ACTION_PREFIX}LAYER_TEXT_LABEL_CHANGE`,
  LAYER_HOVER: `${ACTION_PREFIX}LAYER_HOVER`,
  LAYER_CLICK: `${ACTION_PREFIX}LAYER_CLICK`,
  MAP_CLICK: `${ACTION_PREFIX}MAP_CLICK`,
  MOUSE_MOVE: `${ACTION_PREFIX}MOUSE_MOVE`,
  REMOVE_FILTER: `${ACTION_PREFIX}REMOVE_FILTER`,
  REMOVE_LAYER: `${ACTION_PREFIX}REMOVE_LAYER`,
  REMOVE_DATASET: `${ACTION_PREFIX}REMOVE_DATASET`,
  REORDER_LAYER: `${ACTION_PREFIX}REORDER_LAYER`,
  SET_FILTER: `${ACTION_PREFIX}SET_FILTER`,
  SET_FILTER_ANIMATION_TIME: `${ACTION_PREFIX}SET_FILTER_ANIMATION_TIME`,
  SET_FILTER_ANIMATION_WINDOW: `${ACTION_PREFIX}SET_FILTER_ANIMATION_WINDOW`,
  SHOW_DATASET_TABLE: `${ACTION_PREFIX}SHOW_DATASET_TABLE`,
  UPDATE_LAYER_BLENDING: `${ACTION_PREFIX}UPDATE_LAYER_BLENDING`,
  UPDATE_VIS_DATA: `${ACTION_PREFIX}UPDATE_VIS_DATA`,
  RENAME_DATASET: `${ACTION_PREFIX}RENAME_DATASET`,
  TOGGLE_FILTER_ANIMATION: `${ACTION_PREFIX}TOGGLE_FILTER_ANIMATION`,
  UPDATE_FILTER_ANIMATION_SPEED: `${ACTION_PREFIX}UPDATE_FILTER_ANIMATION_SPEED`,
  PLAY_ANIMATION: `${ACTION_PREFIX}PLAY_ANIMATION`,
  SET_LAYER_ANIMATION_TIME: `${ACTION_PREFIX}SET_LAYER_ANIMATION_TIME`,
  UPDATE_ANIMATION_SPEED: `${ACTION_PREFIX}UPDATE_ANIMATION_SPEED`,
  UPDATE_LAYER_ANIMATION_SPEED: `${ACTION_PREFIX}UPDATE_LAYER_ANIMATION_SPEED`,
  TOGGLE_LAYER_ANIMATION: `${ACTION_PREFIX}TOGGLE_LAYER_ANIMATION`,
  TOGGLE_LAYER_CONFIG_ACTIVE: `${ACTION_PREFIX}TOGGLE_LAYER_CONFIG_ACTIVE`,
  ENLARGE_FILTER: `${ACTION_PREFIX}ENLARGE_FILTER`,
  TOGGLE_FILTER_FEATURE: `${ACTION_PREFIX}TOGGLE_FILTER_FEATURE`,
  TOGGLE_LAYER_FOR_MAP: `${ACTION_PREFIX}TOGGLE_LAYER_FOR_MAP`,
  SET_FILTER_PLOT: `${ACTION_PREFIX}SET_FILTER_PLOT`,
  LOAD_FILES: `${ACTION_PREFIX}LOAD_FILES`,
  LOAD_NEXT_FILE: `${ACTION_PREFIX}LOAD_NEXT_FILE`,
  LOAD_FILE_STEP_SUCCESS: `${ACTION_PREFIX}LOAD_FILE_STEP_SUCCESS`,
  LOAD_FILES_ERR: `${ACTION_PREFIX}LOAD_FILES_ERR`,
  LOAD_FILES_SUCCESS: `${ACTION_PREFIX}LOAD_FILES_SUCCESS`,
  LAYER_COLOR_UI_CHANGE: `${ACTION_PREFIX}LAYER_COLOR_UI_CHANGE`,
  TOGGLE_FEATURE_LAYER: `${ACTION_PREFIX}TOGGLE_FEATURE_LAYER`,
  APPLY_CPU_FILTER: `${ACTION_PREFIX}APPLY_CPU_FILTER`,
  SET_MAP_INFO: `${ACTION_PREFIX}SET_MAP_INFO`,
  SORT_TABLE_COLUMN: `${ACTION_PREFIX}SORT_TABLE_COLUMN`,
  PIN_TABLE_COLUMN: `${ACTION_PREFIX}PIN_TABLE_COLUMN`,
  COPY_TABLE_COLUMN: `${ACTION_PREFIX}COPY_TABLE_COLUMN`,
  NEXT_FILE_BATCH: `${ACTION_PREFIX}NEXT_FILE_BATCH`,
  PROCESS_FILE_CONTENT: `${ACTION_PREFIX}PROCESS_FILE_CONTENT`,
  ADD_MARKER: `${ACTION_PREFIX}ADD_MARKER`,
  REMOVE_MARKER: `${ACTION_PREFIX}REMOVE_MARKER`,
  MOVE_UP_FILTER: `${ACTION_PREFIX}MOVE_UP_FILTER`,
  MOVE_DOWN_FILTER: `${ACTION_PREFIX}MOVE_DOWN_FILTER`,
  ENABLE_DATASET: `${ACTION_PREFIX}ENABLE_DATASET`,
  START_RELOADING_DATASET: `${ACTION_PREFIX}START_RELOADING_DATASET`,
  SET_REPORT_DATA_SOURCE: `${ACTION_PREFIX}SET_REPORT_DATA_SOURCE`,
  SET_REPORT_FIELD: `${ACTION_PREFIX}SET_REPORT_FIELD`,
  SET_REPORT_AGGREGATION: `${ACTION_PREFIX}SET_REPORT_AGGREGATION`,
  SET_REPORT_INTERVAL: `${ACTION_PREFIX}SET_REPORT_INTERVAL`,
  
  // mapProfile
  LOAD_PROFILE: `${ACTION_PREFIX}LOAD_PROFILE`,
  LOAD_PROFILE_SUCCESS: `${ACTION_PREFIX}LOAD_PROFILE_SUCCESS`,
  LOAD_PROFILE_ERROR: `${ACTION_PREFIX}LOAD_PROFILE_ERROR`,
  ADD_PROFILE: `${ACTION_PREFIX}ADD_PROFILE`,
  ADD_PROFILE_SUCCESS: `${ACTION_PREFIX}ADD_PROFILE_SUCCESS`,
  ADD_PROFILE_ERROR: `${ACTION_PREFIX}ADD_PROFILE_ERROR`,
  UPDATE_PROFILE: `${ACTION_PREFIX}UPDATE_PROFILE`,
  UPDATE_PROFILE_SUCCESS: `${ACTION_PREFIX}UPDATE_PROFILE_SUCCESS`,
  UPDATE_PROFILE_ERROR: `${ACTION_PREFIX}UPDATE_PROFILE_ERROR`,
  REMOVE_PROFILE: `${ACTION_PREFIX}REMOVE_PROFILE`,
  REMOVE_PROFILE_SUCCESS: `${ACTION_PREFIX}REMOVE_PROFILE_SUCCESS`,
  REMOVE_PROFILE_ERROR: `${ACTION_PREFIX}REMOVE_PROFILE_ERROR`,
  UPDATE_PROFILE_LABEL: `${ACTION_PREFIX}UPDATE_PROFILE_LABEL`,
  UPDATE_PROFILE_LABEL_SUCCESS: `${ACTION_PREFIX}UPDATE_PROFILE_LABEL_SUCCESS`,
  UPDATE_PROFILE_LABEL_ERROR: `${ACTION_PREFIX}UPDATE_PROFILE_LABEL_ERROR`,
  APPLY_PROFILE: `${ACTION_PREFIX}APPLY_PROFILE`,

  // mapState
  UPDATE_MAP: `${ACTION_PREFIX}UPDATE_MAP`,
  FIT_BOUNDS: `${ACTION_PREFIX}FIT_BOUNDS`,
  TOGGLE_PERSPECTIVE: `${ACTION_PREFIX}TOGGLE_PERSPECTIVE`,
  TOGGLE_SPLIT_MAP: `${ACTION_PREFIX}TOGGLE_SPLIT_MAP`,
  TOGGLE_FULLSCREEN: `${ACTION_PREFIX}TOGGLE_FULLSCREEN`,

  // mapStyle
  MAP_CONFIG_CHANGE: `${ACTION_PREFIX}MAP_CONFIG_CHANGE`,
  SET_DEFAULT_MAP_STYLE: `${ACTION_PREFIX}SET_DEFAULT_MAP_STYLE`,
  MAP_STYLE_CHANGE: `${ACTION_PREFIX}MAP_STYLE_CHANGE`,
  LOAD_MAP_STYLES: `${ACTION_PREFIX}LOAD_MAP_STYLES`,
  LOAD_MAP_STYLE_ERR: `${ACTION_PREFIX}LOAD_MAP_STYLE_ERR`,
  INPUT_MAP_STYLE: `${ACTION_PREFIX}INPUT_MAP_STYLE`,
  LOAD_CUSTOM_MAP_STYLE: `${ACTION_PREFIX}LOAD_CUSTOM_MAP_STYLE`,
  ADD_CUSTOM_MAP_STYLE: `${ACTION_PREFIX}ADD_CUSTOM_MAP_STYLE`,
  REQUEST_MAP_STYLES: `${ACTION_PREFIX}REQUEST_MAP_STYLES`,
  SET_3D_BUILDING_COLOR: `${ACTION_PREFIX}SET_3D_BUILDING_COLOR`,

  // uiState
  TOGGLE_SIDE_PANEL: `${ACTION_PREFIX}TOGGLE_SIDE_PANEL`,
  TOGGLE_MODAL: `${ACTION_PREFIX}TOGGLE_MODAL`,
  SHOW_EXPORT_DROPDOWN: `${ACTION_PREFIX}SHOW_EXPORT_DROPDOWN`,
  HIDE_EXPORT_DROPDOWN: `${ACTION_PREFIX}HIDE_EXPORT_DROPDOWN`,
  OPEN_DELETE_MODAL: `${ACTION_PREFIX}OPEN_DELETE_MODAL`,
  OPEN_DATASET_MODAL: `${ACTION_PREFIX}OPEN_DATASET_MODAL`,
  OPEN_DELETE_DATA_MODAL: `${ACTION_PREFIX}OPEN_DELETE_DATA_MODAL`,
  CLOSE_DELETE_DATA_MODAL: `${ACTION_PREFIX}CLOSE_DELETE_DATA_MODAL`,
  TOGGLE_MAP_CONTROL: `${ACTION_PREFIX}TOGGLE_MAP_CONTROL`,
  ADD_NOTIFICATION: `${ACTION_PREFIX}ADD_NOTIFICATION`,
  REMOVE_NOTIFICATION: `${ACTION_PREFIX}REMOVE_NOTIFICATION`,
  SET_LOCALE: `${ACTION_PREFIX}SET_LOCALE`,
  TOGGLE_GRAPHSHOW_CONTROL: `${ACTION_PREFIX}TOGGLE_GRAPHSHOW_CONTROL`,
  TOGGLE_DATA_REPORT: `${ACTION_PREFIX}TOGGLE_DATA_REPORT`,

  // uiState > export image
  SET_EXPORT_IMAGE_SETTING: `${ACTION_PREFIX}SET_EXPORT_IMAGE_SETTING`,
  START_EXPORTING_IMAGE: `${ACTION_PREFIX}START_EXPORTING_IMAGE`,
  SET_EXPORT_IMAGE_DATA_URI: `${ACTION_PREFIX}SET_EXPORT_IMAGE_DATA_URI`,
  SET_EXPORT_IMAGE_ERROR: `${ACTION_PREFIX}SET_EXPORT_IMAGE_ERROR`,
  CLEANUP_EXPORT_IMAGE: `${ACTION_PREFIX}CLEANUP_EXPORT_IMAGE`,

  // uiState > export data
  SET_EXPORT_SELECTED_DATASET: `${ACTION_PREFIX}SET_EXPORT_SELECTED_DATASET`,
  SET_EXPORT_DATA_TYPE: `${ACTION_PREFIX}SET_EXPORT_DATA_TYPE`,
  SET_EXPORT_FILTERED: `${ACTION_PREFIX}SET_EXPORT_FILTERED`,
  SET_EXPORT_DATA: `${ACTION_PREFIX}SET_EXPORT_DATA`,

  // uiState > export map
  SET_EXPORT_MAP_FORMAT: `${ACTION_PREFIX}SET_EXPORT_MAP_FORMAT`,
  SET_USER_MAPBOX_ACCESS_TOKEN: `${ACTION_PREFIX}SET_USER_MAPBOX_ACCESS_TOKEN`,
  SET_EXPORT_MAP_HTML_MODE: `${ACTION_PREFIX}SET_EXPORT_MAP_HTML_MODE`,

  // uiState > editor
  SET_EDITOR_MODE: `${ACTION_PREFIX}SET_EDITOR_MODE`,
  SET_SELECTED_FEATURE: `${ACTION_PREFIX}SET_SELECTED_FEATURE`,

  // all
  INIT: `${ACTION_PREFIX}INIT`,
  ADD_DATA_TO_MAP: `${ACTION_PREFIX}ADD_DATA_TO_MAP`,
  RECEIVE_MAP_CONFIG: `${ACTION_PREFIX}RECEIVE_MAP_CONFIG`,
  RESET_MAP_CONFIG: `${ACTION_PREFIX}RESET_MAP_CONFIG`,

  // geo-operations
  SET_FEATURES: `${ACTION_PREFIX}SET_FEATURES`,
  SET_POLYGON_FILTER_LAYER: `${ACTION_PREFIX}SET_POLYGON_FILTER_LAYER`,
  DELETE_FEATURE: `${ACTION_PREFIX}DELETE_FEATURE`,
  TOGGLE_EDITOR_VISIBILITY: `${ACTION_PREFIX}TOGGLE_EDITOR_VISIBILITY`,

  // storage
  START_SAVE_STORAGE: `${ACTION_PREFIX}START_SAVE_STORAGE`
};

export default ActionTypes;
