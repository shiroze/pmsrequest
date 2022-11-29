import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';
import {saveIssue, saveReject} from './service';
import {localIssueSV, localRejectSV} from './local';

import {issueStack} from '~/config/navigator';
import NavigationService from '~/utils/navigation';
import { handleError, handleInfo, handleSuccess } from '~/utils/message';

import reactotron from 'reactotron-react-native';

/**
 * Set Barang saga
 * @param products
 * @returns {IterableIterator<*>}
 */
function* setIssue({branch_id, id, username}) {
  try {
    yield call(saveIssue, {branch_id, id, username});

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

function* localIssue({id, username}) {
  try {
    yield call(localIssueSV, {id, username});

    // reactotron.log(Array.isArray(products));

    yield call(handleSuccess, new Error('Barang telah berhasil dikeluarkan'))

    // yield call(NavigationService.navigate, mainStack.add_rent);
    yield call(NavigationService.goBack);
  } catch (e) {
    yield call(handleError, e.message);
  }
}

export default function* issueSaga() {
  yield takeEvery(Actions.ISSUE_ORDER, setIssue);
  yield takeEvery(Actions.LOCAL_ISSUE_ORDER, localIssue);
}