import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';

import NavigationService from '@utils/navigation';
import {rootSwitch} from '@config/navigator';
import {handleError, handleInfo, handleSuccess} from '~/utils/message';

import {checkIP, login, logout} from './service';

import axios from 'axios';
import reactotron from 'reactotron-react-native';

function* getIP({user, loc_id, ip_address}) {
  try {
    const {data} = yield call(checkIP, {
      username: user,
      loc_id,
      ip_address,
    });

    if (data.forceLogout) {
      yield put({type: Actions.SIGN_OUT_SUCCESS});
      // yield call(signOut);
      yield call(
        handleInfo,
        new Error('Sesi kamu telah habis, Logout berhasil'),
      );
    }
  } catch (e) {
    reactotron.log(e);
    yield call(handleError, new Error('Server Error ' + e));
  }
}

/**
 * Sign In saga
 * @param username
 * @param password
 * @returns {IterableIterator<*>}
 */
function* signIn({user, pw, loc_id, ip_address}) {
  try {
    const {data} = yield call(login, {
      username: user,
      password: pw,
      loc_id,
      ip_address,
    });

    if (!data.success) {
      // reactotron.log(e);
      yield put({
        type: Actions.SIGN_IN_FAILED,
        payload: {
          message: data.msg,
        },
      });

      yield call(handleError, new Error(data.msg));
    } else {
      reactotron.log(data.username, data.location);

      yield put({
        type: Actions.SIGN_IN_SUCCESS,
        payload: {username: data.username, location: data.location},
      });
      yield call(handleSuccess, new Error('Login Berhasil'));
    }
  } catch (e) {
    if (e.code == undefined) {
      yield put({
        type: Actions.SIGN_IN_FAILED,
        payload: {
          message: 'Kamu tidak ada otoritas pada cabang ini.',
        },
      });

      yield call(
        handleError,
        new Error('Kamu tidak ada otoritas pada cabang ini.'),
      );
    } else {
      yield put({
        type: Actions.SIGN_IN_FAILED,
        payload: {
          message: e.message,
        },
      });

      yield call(handleError, e);
    }
  }
}

function* isLoginSaga() {
  try {
    // You can check token is expired or not
    reactotron.log('User Login');
  } catch (e) {
    reactotron.log('Is Login Error', e);
  }
}

/**
 * Sign out saga
 */
function* signOutSaga() {
  try {
    // yield call(NavigationService.navigate, rootSwitch.auth);

    yield put({type: Actions.SIGN_OUT_SUCCESS});
    // yield call(signOut);
    yield call(handleInfo, new Error('Logout Berhasil'));
  } catch (e) {
    reactotron.log(e);
  }
}

export default function* authSaga() {
  yield takeEvery(Actions.GET_IP_DIF, getIP);
  yield takeEvery(Actions.SIGN_IN, signIn);
  yield takeEvery(Actions.IS_LOGIN, isLoginSaga);
  yield takeEvery(Actions.SIGN_OUT, signOutSaga);
}