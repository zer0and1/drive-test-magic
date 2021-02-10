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

import { disableStackCapturing, withTask } from 'react-palm/tasks';
import { AUTH_SEVER_API_URL } from 'constants/default-settings';
import { AXIOS_REQUEST_TASK, ACTION_TASK } from 'tasks/tasks';
import { getAuthInfoSuccess, getAuthInfoError } from 'actions/auth-state-actions';
import { loadMinionCommand, loadMinions } from 'actions/minion-state-actions';
import { loadProfile } from 'actions/map-profile-actions';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from "apollo-link-http";
import { HASURA_SERVER_API_ENDPOINT } from 'constants/default-settings';

// react-palm
// disable capture exception for react-palm call to withTask
disableStackCapturing();

/**
 * Updaters for `minionState` reducer. Can be used in your root reducer to directly modify kepler.gl's state.
 * Read more about [Using updaters](../advanced-usage/using-updaters.md)
 *
 * @public
 * @example
 *
 * import keplerGlReducer, {authStateUpdaters} from 'kepler.gl/reducers';
 * // Root Reducer
 * const reducers = combineReducers({
 *  keplerGl: keplerGlReducer,
 *  app: appReducer
 * });
 *
 * const composedReducer = (state, action) => {
 *  switch (action.type) {
 *    case 'CLICK_BUTTON':
 *      return {
 *        ...state,
 *        keplerGl: {
 *          ...state.keplerGl,
 *          foo: {
 *             ...state.keplerGl.foo,
 *             minionState: authStateUpdaters.enlargeFilterUpdater(
 *               state.keplerGl.foo.minionState,
 *               {idx: 0}
 *             )
 *          }
 *        }
 *      };
 *  }
 *  return reducers(state, action);
 * };
 *
 * export default composedReducer;
 */
/* eslint-disable no-unused-vars */
// @ts-ignore
const authStateUpdaters = null;
/* eslint-enable no-unused-vars */

/**
 * Default initial `minionState`
 * @memberof authStateUpdaters
 * @constant
 * @type {authState}
 * @public
 */
export const INITIAL_AUTH_STATE = {
  jwt: null,
  userId: null,
  userToken: null,
  userRole: null,
  isSendingToken: false
};

export const getAuthInfoUpdater = (state, { userToken }) => {
  if (!userToken) {
    const authInfo = localStorage.getItem('auth-info');

    if (authInfo) {
      return getAuthInfoSuccessUpdater(state, { info: JSON.parse(authInfo) });
    }
    else {
      return state;
    }
  }
  else {
    const task = AXIOS_REQUEST_TASK({
      method: 'post',
      url: AUTH_SEVER_API_URL,
      data: {
        user_token: userToken
      }
    }).bimap(
      res => getAuthInfoSuccess(res.data),
      err => getAuthInfoError(err)
    );

    return withTask({
      ...state,
      isSendingToken: true
    }, task);
  }
};

export const getAuthInfoSuccessUpdater = (state, { info }) => {
  const { jwt, user_info: { id, role, user_token } } = info;
  const authInfo = {
    jwt,
    userId: id,
    userRole: role,
    userToken: user_token
  };
  const newState = {
    ...state,
    ...authInfo,
    isSendingToken: false
  };

  global.apolloClient = new ApolloClient({
    link: createHttpLink({
      uri: HASURA_SERVER_API_ENDPOINT,
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    }),
    cache: new InMemoryCache()
  });

  localStorage.setItem('auth-info', JSON.stringify(info));

  const tasks = [
    ACTION_TASK().map(_ => loadMinions(true)),
    role != 'not-allowed' && ACTION_TASK().map(_ => loadMinionCommand()),
    role != 'not-allowed' && ACTION_TASK().map(_ => loadProfile())
  ].filter(d => d);

  return withTask(newState, tasks);
};

export const getAuthInfoErrorUpdater = (state, { error }) => {
  return state;
};