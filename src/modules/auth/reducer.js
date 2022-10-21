import {fromJS} from 'immutable';

import {REHYDRATE} from 'redux-persist/lib/constants';
import * as Actions from './constants';
import {notificationMessage} from '~/utils/message';
import {errorInit as initError} from './config';

const initState = fromJS({
  isLogin: false,
  pending: false,
  user: {},
  username: '',
  location: '',
  loginError: initError,
});

export default function authReducer(state = initState, action = {}) {
  const {type, payload} = action;
  switch (type) {
    case Actions.SIGN_IN:
      return state.set('pending', true).set('loginError', fromJS(initError));
    case Actions.SIGN_IN_SUCCESS:
      return state
        .set('pending', false)
        .set('username', fromJS(payload.username))
        .set('location', fromJS(payload.location))
        .set('isLogin', true);
    case Actions.SIGN_IN_FAILED:
      const errorSignIn = notificationMessage(action.payload);
      return state.set('pending', false).set('loginError', fromJS(errorSignIn));
    case Actions.SIGN_OUT_SUCCESS:
      return initState;
    default:
      return state;
  }
}