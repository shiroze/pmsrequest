import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';

import {mainStack} from '~/config/navigator';
import NavigationService from '~/utils/navigation';
import { handleError, handleInfo, handleSuccess } from '~/utils/message';

import reactotron from 'reactotron-react-native';

/**
 * Set Barang saga
 * @param products
 * @returns {IterableIterator<*>}
 */
function* setBarang({payload}) {
  try {
    yield put({
      type: Actions.UPDATE_CART_SUCCESS,
      payload,
    });

    // reactotron.log(Array.isArray(products));

    yield call(handleSuccess, new Error('Barang berhasil ditambahkan'))

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

function* removeBarang({payload}) {
  try {
    yield put({
      type: Actions.UPDATE_CART_SUCCESS,
      payload,
    });

    // reactotron.log(Array.isArray(products));

    yield call(handleError, new Error('Barang berhasil dibuang'))

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

function* emptyCart() {
  try {
    // reactotron.log(Array.isArray(products));

    yield call(handleSuccess, new Error('Order berhasil dikosongkan'))

    // yield call(NavigationService.navigate, mainStack.add_rent);
    yield call(NavigationService.navigate, mainStack.home);
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
  yield takeEvery(Actions.REMOVE_FROM_CART, removeBarang);
  yield takeEvery(Actions.EMPTY_CART, emptyCart);
}