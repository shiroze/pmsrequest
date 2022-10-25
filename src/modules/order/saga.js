import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';

import NavigationService from '~/utils/navigation';

import reactotron from 'reactotron-react-native';

/**
 * Set Barang saga
 * @param products
 * @returns {IterableIterator<*>}
 */
function* setBarang({products}) {
  try {
    yield put({
      type: Actions.ADD_TO_CART_SUCCESS,
      payload: {products},
    });

    // reactotron.log(Array.isArray(products));

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
  yield takeEvery(Actions.ADD_TO_CART, setBarang);
}