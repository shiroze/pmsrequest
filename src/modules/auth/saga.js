import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';

import {login, logout} from './service';

import {handleError, handleInfo, handleSuccess} from '~/utils/message';

/**
 * Sign In saga
 * @param username
 * @param password
 * @returns {IterableIterator<*>}
 */
 function* signIn({username, password}) {
  try {
    const {user, roles} = yield call(login, {
      username,
      password,
    });

    yield put({
      type: Actions.SIGN_IN_SUCCESS,
      payload: {username, roles},
    });
    yield call(NavigationService.navigate, rootSwitch.main);
    yield call(handleSuccess, new Error('Login Berhasil'))
  } catch (e) {
    // reactotron.log(e);
    yield put({
      type: Actions.SIGN_IN_FAILED,
      payload: {
        message: e.message,
      },
    });

    yield call(handleError, e)
  }
}

export default function* authSaga() {
  yield takeEvery(Actions.SIGN_IN, signIn);
}