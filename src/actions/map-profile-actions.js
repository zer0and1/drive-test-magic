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

// vis-state-reducer
import ActionTypes from 'constants/action-types';
import { gql } from '@apollo/client';
import { receiveMapConfig } from 'actions';

export function loadProfile() {
  const query = gql`
    query {
      signal_db_profiles (
        where: {
          removed: {
            _eq: false
          }
        }
      ) {
        id
        label
        config
        removed
      }
    }
  `;
  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      value: true
    });
    apolloClient.query({
      query,
      fetchPolicy: 'network-only'
    }).then(res => dispatch({
      type: ActionTypes.LOAD_PROFILE,
     profiles: res.data.signal_db_profiles
    }));
  }
}

export function saveProfile() {
  const mutation = gql`
    mutation($label: String!, $config: jsonb) {
      insert_signal_db_profiles_one(
        object: {
          label: $label,
          config: $config
        }
      ) {
        id
        label
        config
      }
    }
  `;

  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SET_SAVING,
      value: true
    });
    apolloClient.mutate({
      variables: {
        label: "New Profile",
        config: getState().main.keplerGl.map.visState.schema.getConfigToSave(
          getState().main.keplerGl.map
        )
      },
      mutation
    }).then(res => dispatch({
      type: ActionTypes.SAVE_PROFILE,
      newProfile: res.data.insert_signal_db_profiles_one
    }));
  }
}

export function updateProfile() {
  const mutation = gql`
    mutation($id: uuid!, $config: jsonb) {
      update_signal_db_profiles_by_pk (
        pk_columns: {id: $id}
        _set: {config: $config}
      ) {
        id
        label
        config
      }
    }
  `;

  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SET_UPDATING,
      value: true
    });
    apolloClient.mutate({
      variables: {
        id: getState().main.keplerGl.map.mapProfile.selectedId,
        config: getState().main.keplerGl.map.visState.schema.getConfigToSave(
          getState().main.keplerGl.map
        )
      },
      mutation
    }).then(res => dispatch({
      type: ActionTypes.UPDATE_PROFILE,
      profile: res.data.update_signal_db_profiles_by_pk
    }));
  }
}

export function applyProfile(id) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SET_PROFILE_APPLYING,
      action: {
        id,
        value: true
      }
    });
    const profile = getState().main.keplerGl.map.mapProfile.profiles.find(profile => profile.id === id);
    Promise.resolve(
      dispatch(receiveMapConfig(getState().main.keplerGl.map.visState.schema.parseSavedConfig(profile.config), {
        keepExistingConfig: false
      }))
    ).then(() => dispatch({
      type: ActionTypes.SET_PROFILE_APPLYING,
      action: {
        id,
        value: false
      }
    }));
  }
}

export function removeProfile(id) {
  const mutation = gql`
    mutation {
      update_signal_db_profiles_by_pk (
        pk_columns: {
          id: "${id}"
        },
        _set: {
          removed: true
        }
      ) {
        id
        label
        config
        removed
      }
    }
  `;

  return (dispatch) => {
    dispatch({
      type: ActionTypes.SET_PROFILE_REMOVING,
      action: {
        id,
        value: true
      }
    });
    apolloClient.mutate({
      mutation
    }).then(res => {
      if (res.data.update_signal_db_profiles_by_pk.removed) {
        return dispatch({
          type: ActionTypes.REMOVE_PROFILE,
          id
        });
      }
    });
  }
}

export function updateProfileLabel(id, label) {
  const mutation = gql`
    mutation {
      update_signal_db_profiles_by_pk (
        pk_columns: {
          id: "${id}"
        },
        _set: {
          label: "${label}"
        }
      ) {
        id
        label
        config
        removed
      }
    }
  `;

  return (dispatch) => {
    apolloClient.mutate({
      mutation
    }).then(res => {
      if (res.data.update_signal_db_profiles_by_pk.label === label) {
        return dispatch({
          type: ActionTypes.UPDATE_PROFILE_LABEL,
          action: {
            id,
            label
          }
        });
      }
    });
  }
}