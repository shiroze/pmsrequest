import {createSelector} from 'reselect';
import {fromJS} from 'immutable';

export const rootOrder = (state) => state.order;

export const orderSelector = createSelector(rootOrder, (data) =>
  data.get('orderCart'),
);