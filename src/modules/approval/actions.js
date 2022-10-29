import * as Actions from './constants';

export function approveOrder({id}) {
  return {
    type: Actions.APPROVE_ORDER,
    id,
  };
}

export function rejectItem({id, itemCode}) {
  return {
    type: Actions.REJECT_ITEM,
    id, 
    itemCode
  };
}