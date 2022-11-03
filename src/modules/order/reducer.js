import {fromJS} from 'immutable';

import {REHYDRATE} from 'redux-persist/lib/constants';
import * as Actions from './constants';

const initState = fromJS({
  orderCart: []
});

export default function orderReducer(state = initState, {type, payload}) {
  switch (type) {
    case Actions.UPDATE_CART_SUCCESS:
      return state.set('orderCart', fromJS(payload));
    case Actions.CHECKOUT_SUCCESS:
      return initState;
    case Actions.EMPTY_CART:
      return initState;
    default:
      return state;
  }
}