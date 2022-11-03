import {createSelector} from 'reselect';
import {fromJS} from 'immutable';

export const rootAuth = (state) => state.auth;
export const authSelector = createSelector(rootAuth, (data) => data.toJS());

export const accessSelector = createSelector(
  rootAuth,
  (data) => data.getIn(['accessRight']) || fromJS([]),
)
export const isLoginSelector = createSelector(
  rootAuth, 
  (data) => data.get('isLogin'),
);
export const locationSelector = createSelector(
  rootAuth, 
  (data) => data.getIn(['location']) || fromJS([]),
);