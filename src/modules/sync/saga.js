import {put, call, select, takeEvery, delay} from 'redux-saga/effects';

import * as Actions from './constants';

import {Sync_Data, Sync_Stock, Post_Data} from './service';
import {localDataUpdate, getLocalDataTable} from './local';

import {mainStack, approvalStack} from '~/config/navigator';

import NavigationService from '~/utils/navigation';
import { handleError, handleInfo, handleSuccess } from '~/utils/message';

import reactotron from 'reactotron-react-native';

const db_schema = require('~/modules/sync/db_schema.json');

function* SyncData({branch_id}) {
  try {
    let i = 0;
    yield put({type: Actions.SYNC_START, payload: db_schema.filter((element) => element.SYNC_TYPE == 'GET'  && element.ALLOWED).length});
    
    for(let element of db_schema) {
      if(element.SYNC_TYPE == 'GET' && element.ALLOWED) {
        /**
         * @param : branch_id,
         * @param : APIURL
         * @return : Get data from Server
         */
        const {data} = yield call(Sync_Data, {branch_id, APIURL: element.API_NAME});
        if(data.error) {
          throw Error(data.message);
        } else {
          /**
           * Insert data to local database
           * delete all data from table
           * insert all data from server
           */
          const resupdate = yield call(localDataUpdate, {data: data.data, table: element.NAME, column: element.COLUMN});
          if(resupdate.data.error) {
            throw Error(resupdate.data.message);
          } else {
            yield put({type: Actions.SYNC_PROGRESS, 
              payload: {
                name: element.NAME,
                module: ++i
              }
            });
          }
        }
      }
      yield delay(700);
    }

    yield put({
      type: Actions.SYNC_FINISH
    })
    // yield call(NavigationService.navigate, mainStack.approval);
    yield call(handleSuccess, new Error('Sinkronisasi Data berhasil'));
  } catch (e) {
    yield call(handleError, e);
  }
}

function* SyncDownload({branch_id, element}) {
  try {
    let i = 0;
    
    /**
     * @param : branch_id,
     * @param : APIURL
     * @return : Get data from Server
     */
    const {data} = yield call(Sync_Data, {branch_id, APIURL: element.API_NAME});
    if(data.error) {
      throw Error(data.message);
    } else {
      yield put({type: Actions.SYNC_START, payload: data.data.length});

      /**
      * Insert data to local database
      * delete all data from table
      * insert all data from server
      */
       const resupdate = yield call(localDataUpdate, {data: data.data, table: element.NAME, column: element.COLUMN});
       if(resupdate.data.error) {
         throw Error(resupdate.data.message);
       } else {
        yield put({type: Actions.SYNC_PROGRESS, 
          payload: {
            name: element.NAME,
            module: ++i
          }
        });
       }
    }

    yield put({
      type: Actions.SYNC_FINISH
    })

    // yield call(NavigationService.navigate, mainStack.approval);
    yield call(handleSuccess, new Error('Sinkronisasi Data berhasil'));
  } catch (e) {
    yield call(handleError, e);
  }
}

function* SyncUpload({branch_id}) {
  try {
    let i = 0;
    yield put({type: Actions.SYNC_START, payload: db_schema.filter((element) => element.SYNC_TYPE == 'POST'  && element.ALLOWED).length});
    
    for(let element of db_schema) {
      if(element.SYNC_TYPE == 'POST' && element.ALLOWED) {
        const {data} = yield call(getLocalDataTable, {table: element.NAME, condition: element.CONDITION});
        if(data.error) {
          throw Error(data.message);
        } else {
          const resupdate = yield call(Post_Data, { branch_id, APIURL: element.API_NAME, data: data.data });
          if(resupdate.data.error) {
            throw Error(resupdate.data.message);
          } else {
            yield put({type: Actions.SYNC_PROGRESS, 
              payload: {
                name: element.NAME,
                module: ++i
              }
            });
          }
        }
      }
    }

    yield put({
      type: Actions.SYNC_FINISH
    });
    
    yield call(handleSuccess, new Error('Sinkronisasi Data berhasil'));
  } catch (e) {
    yield call(handleError, e);
  }
}

/**
 * Selalu Update Stock terbaru ketika sudah selesai melakukan sinkronisasi
 */
function* SyncFinish({branch_id}) {
  try {
    let stock_schema = {
      "NAME" : "STORESTOCK",
      "COLUMN": ["STORECODE", "ITEMCODE", "QTYONHAND", "QTYHOLD"],
      "API_NAME": "sync_stock",
      "SYNC_TYPE": "GET",
      "ALLOWED": true
    }
    
    /**
     * @param : branch_id,
     * @param : APIURL
     * @return : Get data from Server
    */
    const {data} = yield call(Sync_Data, {branch_id, APIURL: stock_schema.API_NAME});
    if(data.error) {
      throw Error(data.message);
    } else {
      /**
      * Insert data to local database
      * delete all data from table
      * insert all data from server
      */
      const resupdate = yield call(localDataUpdate, {data: data.data, table: stock_schema.NAME, column: stock_schema.COLUMN});
      if(resupdate.data.error) {
        throw Error(resupdate.data.message);
      }
    }
  } catch (e) {
    yield call(handleError, e);
  }
}

export default function* syncSaga() {
  yield takeEvery(Actions.SYNC_DATA, SyncData);
  yield takeEvery(Actions.SYNC_DOWNLOAD, SyncDownload);
  yield takeEvery(Actions.SYNC_UPLOAD, SyncUpload);
  yield takeEvery(Actions.SYNC_FINISH, SyncFinish);
}