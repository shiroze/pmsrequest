import {combineReducers} from 'redux';

import authReducer from '~/modules/auth/reducer';
import orderReducer from '~/modules/order/reducer';
import syncReducer from '~/modules/sync/reducer';

/**
 * Root reducer
 * @type {Reducer<any> | Reducer<any, AnyAction>}
 */
const rootReducers = combineReducers({
  auth: authReducer,
  order: orderReducer,
  sync: syncReducer,
});

export default rootReducers;
