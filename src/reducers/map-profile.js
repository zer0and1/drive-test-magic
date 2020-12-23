import ActionTypes from 'constants/action-types';
import {handleActions} from 'redux-actions';
import * as mapProfileUpdaters from './map-profile-updaters';

const actionHandler = {  
  [ActionTypes.LOAD_PROFILE]: mapProfileUpdaters.loadProfileUpdater,

  [ActionTypes.SAVE_PROFILE]: mapProfileUpdaters.saveProfileUpdater,
  
  [ActionTypes.REMOVE_PROFILE]: mapProfileUpdaters.removeProfileUpdater,
  
  [ActionTypes.UPDATE_PROFILE_LABEL]: mapProfileUpdaters.updateProfileLabelUpdater,

  [ActionTypes.SET_LOADING]: mapProfileUpdaters.setLoadingUpdater,

  [ActionTypes.SET_SAVING]: mapProfileUpdaters.setSavingUpdater,

  [ActionTypes.SET_PROFILE_REMOVING]: mapProfileUpdaters.setRemovingUpdater,

  [ActionTypes.SET_PROFILE_APPLYING]: mapProfileUpdaters.setApplyingUpdater,

};

export const mapProfileReducerFactory = (initialState = {}) =>
  handleActions(actionHandler, {
    ...mapProfileUpdaters.INITIAL_VIS_STATE,
    ...initialState,
    initialState
  });

export default mapProfileReducerFactory();
