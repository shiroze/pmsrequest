import {put, call, select, takeEvery} from 'redux-saga/effects';
import moment from 'moment';

import * as Actions from './constants';

import {login, logout} from './service';
import {LocalSignIn} from './local';

import {rootSwitch} from '~/config/navigator';
import NavigationService from '~/utils/navigation';
import {handleError, handleInfo, handleSuccess} from '~/utils/message';
import reactotron from 'reactotron-react-native';

/**
 * Sign In saga
 * @param username
 * @param password
 * @returns {IterableIterator<*>}
 */
function* signIn({branch_id, username, password}) {
  try {
    const {data} = yield call(login, {
      branch_id,
      username,
      password,
    });

    if(!data.error) {
      yield put({
        type: Actions.SIGN_IN_SUCCESS,
        payload: {
          user: data.data[0],
          location: branch_id,
          accessRight: data.data[0].accessRight.filter(val => val.namaModul.includes('Warehouse'))
        }
      });
  
      yield call(NavigationService.navigate, rootSwitch.main);
      yield call(handleSuccess, new Error('Login Berhasil'))
    } else {
      yield call(handleError, new Error(data.message));
    }
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

function* localSignIn({branch_id, username, password}) {
  try {
    const {error, data, message} = yield call(LocalSignIn, {
      username,
      password,
    });
    
    if(!error) {
      yield put({
        type: Actions.SIGN_IN_SUCCESS,
        payload: {
          user: data[0],
          location: branch_id,
          accessRight: data[0].accessRight
        }
      });
  
      yield call(NavigationService.navigate, rootSwitch.main);
      yield call(handleSuccess, new Error('Login Berhasil'));
    } else {
      yield call(handleError, new Error(message));
      
      yield put({
        type: Actions.SIGN_IN_FAILED,
        payload: {
          message
        },
      });
    }
  } catch (e) {
    // reactotron.log(e);
    yield put({
      type: Actions.SIGN_IN_FAILED,
      payload: {
        message: e.message,
      },
    });

    yield call(handleError, e);
  }
}

function* signOut({expired = false}) {
  yield put({
    type: Actions.SIGN_OUT_SUCCESS
  });
  
  yield call(NavigationService.navigate, rootSwitch.login);
  
  if(expired) {
    yield call(handleSuccess, new Error('Sesi berakhir, silahkan login kembali'));
  } else {
    yield call(handleSuccess, new Error('Logout Berhasil'));
  }
}

export default function* authSaga() {
  yield takeEvery(Actions.SIGN_IN, signIn);
  yield takeEvery(Actions.LOCAL_SIGN_IN, localSignIn);
  yield takeEvery(Actions.SIGN_OUT, signOut);
}