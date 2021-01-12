import { disableStackCapturing, withTask } from 'react-palm/tasks';
import { GRAPHQL_QUERY_TASK, ACTION_TASK } from 'tasks/tasks';

import {
  GQL_GET_PROFILES,
  GQL_INSERT_PROFILE,
  GQL_UPDATE_PROFILE,
  GQL_REMOVE_PROFILE,
  GQL_UPDATE_PROFILE_LABEL
} from 'graphqls';

import {
  loadProfileSuccess,
  loadProfileError,
  addProfileSuccess,
  addProfileError,
  updateProfileSuccess,
  updateProfileError,
  removeProfileSuccess,
  removeProfileError,
  updateProfileLabelSuccess,
  updateProfileLabelError
} from 'actions/map-profile-actions';

import { GRAPHQL_MUTATION_TASK } from '../tasks/tasks';
import KeplerGlSchema from 'schemas';
import { addDataToMap } from 'actions/actions';

// react-palm
// disable capture exception for react-palm call to withTask
disableStackCapturing();

export const INITIAL_MAP_PROFILE_STATE = {
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isLabelUpdating: false,
  selectedId: null,
  profiles: []
};


export const loadProfileUpdater = (state) => {
  const query = GQL_GET_PROFILES();
  const loadProfileTask = GRAPHQL_QUERY_TASK({ query }).bimap(
    res => loadProfileSuccess(res.data.signal_db_profiles),
    err => loadProfileError(err)
  );
  const newState = { ...state, isLoading: true };

  return withTask(newState, loadProfileTask);
};

export const loadProfileSuccessUpdater = (state, { profiles }) => {
  return {
    ...state,
    isLoading: false,
    profiles
  }
};


export const loadProfileErrorUpdater = (state, { error }) => {
  return {
    ...state,
    isLoading: false,
    error
  }
};

export const addProfileUpdater = (state, { map }) => {
  const mutation = GQL_INSERT_PROFILE();
  const insertProfileTask = GRAPHQL_MUTATION_TASK({
    variables: {
      label: "New Profile",
      config: KeplerGlSchema.getConfigToSave(map)
    },
    mutation
  }).bimap(
    res => addProfileSuccess(res.data.insert_signal_db_profiles_one),
    err => addProfileError(err)
  );
  const newState = { ...state, isAdding: true };

  return withTask(newState, insertProfileTask);
};

export const addProfileSuccessUpdater = (state, { profile }) => {
  return {
    ...state,
    profiles: [
      ...state.profiles,
      profile
    ],
    isAdding: false
  }
};

export const addProfileErrorUpdater = (state, { error }) => {
  return {
    ...state,
    isAdding: false,
    error
  }
};

export const updateProfileUpdater = (state, { map }) => {
  const mutation = GQL_UPDATE_PROFILE();
  const updateProfileTask = GRAPHQL_MUTATION_TASK({
    variables: {
      id: state.selectedId,
      config: KeplerGlSchema.getConfigToSave(map)
    },
    mutation
  }).bimap(
    res => updateProfileSuccess(res.data.update_signal_db_profiles_by_pk),
    err => updateProfileError(err)
  );
  const newState = { ...state, isUpdating: true };

  return withTask(newState, updateProfileTask);
};

export const updateProfileSuccessUpdater = (state, { profile }) => {
  return {
    ...state,
    profiles: state.profiles.map(p => p.id == profile.id ? profile : p),
    isUpdating: false
  }
};

export const updateProfileErrorUpdater = (state, { error }) => {
  return {
    ...state,
    isUpdating: false,
    error
  }
};

export const applyProfileUpdater = (state, { id, map }) => {
  const { config } = state.profiles.find(p => p.id == id);
  const { datasets } = KeplerGlSchema.save(map);
  console.log(datasets)
  const mapToLoad = KeplerGlSchema.load(datasets, config);
  const task = ACTION_TASK().map(_ => addDataToMap({ ...mapToLoad, options: { centerMap: false } }));
  const newState = {
    ...state,
    selectedId: id
  };

  return withTask(newState, task); 
};


export const removeProfileUpdater = (state, { id }) => {
  const mutation = GQL_REMOVE_PROFILE();
  const removeProfileTask = GRAPHQL_MUTATION_TASK({
    variables: { id },
    mutation
  }).bimap(
    res => removeProfileSuccess(res.data.update_signal_db_profiles_by_pk),
    err => removeProfileError(err)
  );
  const newState = { ...state, profiles: state.profiles.map(profile => profile.id == id ? { ...profile, isRemoving: true } : profile) };

  return withTask(newState, removeProfileTask);
};

export const removeProfileSuccessUpdater = (state, { profile: { id } }) => {
  return {
    ...state,
    profiles: state.profiles.filter(profile => profile.id !== id),
    selectedId: state.selectedId == id ? null : state.selectedId
  }
};

export const removeProfileErrorUpdater = (state, { error }) => {
  return {
    ...state,
    profiles: state.profiles.map(p => ({ ...p, isRemoving: false })),
    error
  }
};

export const updateProfileLabelUpdater = (state, { id, label }) => {
  const mutation = GQL_UPDATE_PROFILE_LABEL();
  const updateProfileLabelTask = GRAPHQL_MUTATION_TASK({
    variables: { id, label },
    mutation
  }).bimap(
    res => updateProfileLabelSuccess(res.data.update_signal_db_profiles_by_pk),
    err => updateProfileLabelError(err)
  );
  const newState = { ...state, isLabelUpdating: true };

  return withTask(newState, updateProfileLabelTask);
};

export const updateProfileLabelSuccessUpdater = (state, { profile: { id, label } }) => {
  return {
    ...state,
    profiles: state.profiles.map(p => p.id == id ? { ...p, label } : p),
    isLabelUpdating: false
  }
};

export const updateProfileLabelErrorUpdater = (state, { error }) => {
  return {
    ...state,
    isLabelUpdating: false,
    error
  }
};
