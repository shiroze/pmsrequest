import * as Actions from './constants';

export function approveOrder({branch_id, id, username, stage}) {
  return {
    type: Actions.APPROVE_ORDER,
    branch_id, id, username, stage
  };
}

export function rejectItem({branch_id, id, itemCode, alasan, username}) {
  return {
    type: Actions.REJECT_ITEM,
    branch_id,
    id, 
    itemCode,
    alasan,
    username
  };
}