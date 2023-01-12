import {fromJS, List} from 'immutable';
import moment from 'moment';

import {REHYDRATE} from 'redux-persist/lib/constants';
import * as Actions from './constants';
import {notificationMessage} from '~/utils/message';
import {errorInit as initError} from './config';
import reactotron from 'reactotron-react-native';

const initState = fromJS({
  isLogin: false,
  pending: false,
  user: {},
  accessRight: List(),
  username: '',
  location: '',
  loginError: initError,
  timeOut: moment().add(2, 'h')
});

export default function authReducer(state = initState, {type, payload}) {
  switch (type) {
    case Actions.SIGN_IN:
      return state.set('pending', true).set('loginError', fromJS(initError));
    case Actions.LOCAL_SIGN_IN:
        return state.set('pending', true).set('loginError', fromJS(initError));
    case Actions.SIGN_IN_SUCCESS:
      return state
        .set('pending', false)
        .set('user', payload.user)
        .set('timeout', moment().add(2, 'h'))
        /**
         * Don't use fromJS to set Value
         */
        .set('accessRight', payload.accessRight)
        .set('location', payload.location)
        .set('isLogin', true);
    case Actions.SET_SESSION:
      return state.set('timeOut', payload);
    case Actions.SIGN_IN_FAILED:
      const errorSignIn = notificationMessage(payload);
      return state.set('pending', false).set('loginError', fromJS(errorSignIn));
    case Actions.SIGN_OUT_SUCCESS:
      return state.set('isLogin', false)
                  .set('pending', false)
                  .set('user', {})
                  .set('accessRight', List())
                  .set('timeout', null);
    default:
      return state;
  }
}