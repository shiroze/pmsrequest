import {put, call, select, takeEvery} from 'redux-saga/effects';

import * as Actions from './constants';

import {saveRequest, saveItem} from './service';

import {mainStack, approvalStack} from '~/config/navigator';
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

function* setSaveItem({branch_id, id, itemCode, qty, keterangan}) {
  try {
    const {data} = yield call(saveItem, {branch_id, id, itemCode, qty, keterangan});

    if(!data.error) {
      yield call(handleSuccess, new Error('Barang berhasil diupdate'))

      // yield call(NavigationService.replace, approvalStack.home);
      yield call(NavigationService.goBack);
    } else {
      yield call(handleError, new Error(data.message));
    }
  } catch (e) {
    reactotron.log(e)
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

function* checkout({branch_id, username, cart}) {
  try {
    const {data} = yield call(saveRequest, {
      branch_id,
      username,
      cart,
    });

    if(!data.error) {
      yield put({
        type: Actions.CHECKOUT_SUCCESS,
      });

      yield call(NavigationService.navigate, mainStack.approval);
      yield call(handleSuccess, new Error('Request berhasil disubmit'));
    } else {
      yield call(handleError, new Error(data.message));
    }
    // reactotron.log(data);
  } catch (e) {
    yield call(handleError, e);
  }
}

export default function* orderSaga() {
  yield takeEvery(Actions.ADD_TO_CART, setBarang);
  yield takeEvery(Actions.SAVE_ITEM, setSaveItem);
  yield takeEvery(Actions.REMOVE_FROM_CART, removeBarang);
  yield takeEvery(Actions.EMPTY_CART, emptyCart);
  yield takeEvery(Actions.CHECKOUT, checkout);
}