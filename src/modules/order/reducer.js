import {fromJS} from 'immutable';

import {REHYDRATE} from 'redux-persist/lib/constants';
import * as Actions from './constants';
import {notificationMessage} from '~/utils/message';
import {errorInit as initError} from './config';

const initState = fromJS({
  orderCart: []
});

export default function orderReducer(state = initState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case Actions.ADD_TO_CART_SUCCESS:
      return state.set('orderCart', payload.products);
    case Actions.EMPTY_CART:
      return initState;
    default:
      return state;
  }
}