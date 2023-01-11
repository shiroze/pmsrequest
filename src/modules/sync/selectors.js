import {createSelector} from 'reselect';
import {fromJS} from 'immutable';

export const rootSync = (state) => state.sync;

export const currentModulesSelector = createSelector(
  rootSync,
  (sync) => sync.get('currentModule'),
);

export const totalModuleDone = createSelector(
  rootSync,
  (sync) => sync.get('totalModuleDone'),
);

export const totalModule = createSelector(
  rootSync,
  (sync) => sync.get('totalModule'),
);

export const lastUpdateSelector = createSelector(
  rootSync,
  (sync) => sync.get('lastUpdate'),
)