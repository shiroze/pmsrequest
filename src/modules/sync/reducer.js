import {fromJS} from 'immutable';

import {REHYDRATE} from 'redux-persist/lib/constants';
import * as Actions from './constants';
import moment from 'moment';

const initState = fromJS({
  lastUpdate: null,
  currentModule: '',
  totalModule: 0,
  totalModuleDone: 0,
});

export default function syncReducer(state = initState, {type, payload}) {
  switch (type) {
    case Actions.SYNC_START:
      return state.set('totalModule', payload);
    case Actions.SYNC_PROGRESS:
      return state.set('currentModule', payload.name)
                  .set('totalModuleDone', payload.module);
    case Actions.SYNC_FINISH:
      return state.set('lastUpdate', moment().format('YYYY-MM-DD HH:mm:ss'))
                  .set('totalModule', 0)
                  .set('totalModuleDone', 0)
                  .set('currentModule', '');
    default:
      return state;
  }
}