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

import ActionTypes from 'constants/action-types';

export function loadProfile() {
  return {
    type: ActionTypes.LOAD_PROFILE
  }
};

export function loadProfileSuccess(profiles) {
  return {
    type: ActionTypes.LOAD_PROFILE_SUCCESS,
    profiles
  }
};

export function loadProfileError(error) {
  return {
    type: ActionTypes.LOAD_PROFILE_ERROR,
    error
  }
};

export function addProfile(map) {
  return {
    type: ActionTypes.ADD_PROFILE,
    map
  }
};

export function addProfileSuccess(profile) {
  return {
    type: ActionTypes.ADD_PROFILE_SUCCESS,
    profile
  }
};

export function addProfileError(error) {
  return {
    type: ActionTypes.ADD_PROFILE_ERROR,
    error
  }
};

export function updateProfile(map) {
  return {
    type: ActionTypes.UPDATE_PROFILE,
    map
  }
};

export function updateProfileSuccess(profile) {
  return {
    type: ActionTypes.UPDATE_PROFILE_SUCCESS,
    profile
  }
};

export function updateProfileError(error) {
  return {
    type: ActionTypes.UPDATE_PROFILE_ERROR,
    error
  }
};

export function applyProfile(id, map) {
  return {
    type: ActionTypes.APPLY_PROFILE,
    id,
    map
  }
};

export function removeProfile(id) {
  return {
    type: ActionTypes.REMOVE_PROFILE,
    id
  }
};

export function removeProfileSuccess(profile) {
  return {
    type: ActionTypes.REMOVE_PROFILE_SUCCESS,
    profile
  }
};

export function removeProfileError(error) {
  return {
    type: ActionTypes.REMOVE_PROFILE_ERROR,
    error
  }
};


export function updateProfileLabel(id, label) {
  return {
    type: ActionTypes.UPDATE_PROFILE_LABEL,
    id,
    label
  }
};

export function updateProfileLabelSuccess(profile) {
  return {
    type: ActionTypes.UPDATE_PROFILE_LABEL_SUCCESS,
    profile
  }
};

export function updateProfileLabelError(error) {
  return {
    type: ActionTypes.UPDATE_PROFILE_LABEL_ERROR,
    error
  }
};