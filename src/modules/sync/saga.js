import {put, call, select, takeEvery, delay} from 'redux-saga/effects';

import * as Actions from './constants';

import {Sync_Data, Sync_Stock, Post_Data} from './service';
import {localDataUpdate, localStockUpdate, getLocalRequest, getLocalRDetail} from './local';

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
         yield put({type: Actions.SYNC_PROGRESS, payload: data.data.length});
       }
    }

    // yield call(NavigationService.navigate, mainStack.approval);
    yield call(handleSuccess, new Error('Sinkronisasi Data berhasil'));
  } catch (e) {
    yield call(handleError, e);
  }
}

function* SyncUpload({branch_id}) {
  try {
    const {data} = yield call(getLocalRequest, {branch_id});

    if(data.error) {
      throw Error(data.message);
    } else {
      if(data.data.length > 0) {
        for(let element of data.data) {
          /**
           * Mengambil data Request Detail
           */
          // reactotron.log(element);
          // const {data} = yield call(Post_Data, {branch_id, data: element});
          // if(data.error) {
          //   throw Error(data.message);
          // } else {
          //   yield call(handleSuccess, new Error('Syncronisasi Data berhasil'));
          // }
        }
      } else {
        yield call(handleInfo, new Error('Tidak ada data yang akan disinkronisasi'));
      }
    }
  } catch (e) {
    yield call(handleError, e);
  }
}

function* SyncStock({branch_id}) {
  try {
    const {data} = yield call(Sync_Stock, {branch_id});

    if(!data.error) {
      const resupdate = yield call(localStockUpdate, {data: data.data});

      if(!resupdate.data.error) {
        yield call(NavigationService.navigate, mainStack.approval);
        yield call(handleSuccess, new Error('Sinkronisasi Data Stock berhasil'));
      } else {
        yield call(handleError, new Error(resupdate.data.message));
      }
    } else {
      yield call(handleError, new Error(data.message));
    }
  } catch (e) {
    yield call(handleError, e);
  }
}

export default function* syncSaga() {
  yield takeEvery(Actions.SYNC_DATA, SyncData);
  yield takeEvery(Actions.SYNC_DOWNLOAD, SyncDownload);
  yield takeEvery(Actions.SYNC_UPLOAD, SyncUpload);
  yield takeEvery(Actions.SYNC_STOCK, SyncStock);
}