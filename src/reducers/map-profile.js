import ActionTypes from 'constants/action-types';
import {handleActions} from 'redux-actions';
import * as mapProfileUpdaters from './map-profile-updaters';

const actionHandler = {  
  [ActionTypes.LOAD_PROFILE]: mapProfileUpdaters.loadProfileUpdater,
  [ActionTypes.LOAD_PROFILE_SUCCESS]: mapProfileUpdaters.loadProfileSuccessUpdater,
  [ActionTypes.LOAD_PROFILE_ERROR]: mapProfileUpdaters.loadProfileErrorUpdater,

  [ActionTypes.ADD_PROFILE]: mapProfileUpdaters.addProfileUpdater,
  [ActionTypes.ADD_PROFILE_SUCCESS]: mapProfileUpdaters.addProfileSuccessUpdater,
  [ActionTypes.ADD_PROFILE_ERROR]: mapProfileUpdaters.addProfileErrorUpdater,

  [ActionTypes.UPDATE_PROFILE]: mapProfileUpdaters.updateProfileUpdater,
  [ActionTypes.UPDATE_PROFILE_SUCCESS]: mapProfileUpdaters.updateProfileSuccessUpdater,
  [ActionTypes.UPDATE_PROFILE_ERROR]: mapProfileUpdaters.updateProfileErrorUpdater,

  [ActionTypes.REMOVE_PROFILE]: mapProfileUpdaters.removeProfileUpdater,
  [ActionTypes.REMOVE_PROFILE_SUCCESS]: mapProfileUpdaters.removeProfileSuccessUpdater,
  [ActionTypes.REMOVE_PROFILE_ERROR]: mapProfileUpdaters.removeProfileErrorUpdater,

  [ActionTypes.UPDATE_PROFILE_LABEL]: mapProfileUpdaters.updateProfileLabelUpdater,
  [ActionTypes.UPDATE_PROFILE_LABEL_SUCCESS]: mapProfileUpdaters.updateProfileLabelSuccessUpdater,
  [ActionTypes.UPDATE_PROFILE_LABEL_ERROR]: mapProfileUpdaters.updateProfileLabelErrorUpdater,

  [ActionTypes.APPLY_PROFILE]: mapProfileUpdaters.applyProfileUpdater,
};

export const mapProfileReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {
    ...mapProfileUpdaters.INITIAL_MAP_PROFILE_STATE,
    ...initialState,
    initialState
  });

export default mapProfileReducerFactory();
