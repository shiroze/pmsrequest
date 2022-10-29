import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';
import {saveApprove, saveReject} from './service';

import {mainStack} from '~/config/navigator';
import NavigationService from '~/utils/navigation';
import { handleError, handleInfo, handleSuccess } from '~/utils/message';

import reactotron from 'reactotron-react-native';

/**
 * Set Barang saga
 * @param products
 * @returns {IterableIterator<*>}
 */
function* setApprove({id}) {
  try {
    yield call(saveApprove, {id});

    // reactotron.log(Array.isArray(products));

    yield call(handleSuccess, new Error('Order berhasil disetujui'))

    // yield call(NavigationService.navigate, mainStack.add_rent);
    yield call(NavigationService.goBack);
  } catch (e) {
    reactotron.log(e);
    // yield put({
    //   type: Actions.SIGN_IN_FAILED,
    //   payload: {
    //     message: e.message,
    //   },
    // });

    // yield call(handleError, e);
  }
}

function* setReject({id, itemCode}) {
  try {
    yield call(saveReject, {id, itemCode});

    // reactotron.log(Array.isArray(products));

    yield call(handleError, new Error('Barang berhasil reject/tolak'))

    // yield call(NavigationService.navigate, mainStack.add_rent);
    yield call(NavigationService.goBack);
  } catch (e) {
    reactotron.log(e);
    // yield put({
    //   type: Actions.SIGN_IN_FAILED,
    //   payload: {
    //     message: e.message,
    //   },
    // });

    // yield call(handleError, e);
  }
}

export default function* orderSaga() {
  yield takeEvery(Actions.APPROVE_ORDER, setApprove);
  yield takeEvery(Actions.REJECT_ITEM, setReject);
}