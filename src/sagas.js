import {all} from 'redux-saga/effects';

import authSaga from './modules/auth/saga';
import orderSaga from './modules/order/saga';
import approvalSaga from './modules/approval/saga';
import issueSaga from './modules/issue/saga';
// import commonSaga from './modules/common/saga';
// import orderSaga from './modules/order/saga';
// import vendorSaga from './modules/vendor/saga';
import SyncSaga from './modules/sync/saga';

/**
 * Root saga
 * @returns {IterableIterator<AllEffect | GenericAllEffect<any> | *>}
 */
export default function* rootSagas() {
  yield all([
    // commonSaga(),
    authSaga(),
    // cartSaga(),
    // categorySaga(),
    // productSaga(),
    orderSaga(),
    // vendorSaga(),
    issueSaga(),
    approvalSaga(),
    SyncSaga(),
  ]);
}
