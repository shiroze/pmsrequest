import request from '~/utils/fetch';

export const saveRequest = ({branch_id,username, cart}) => 
  request.post(branch_id,'/request/save', {username, cart});

export const saveItem = ({branch_id, id, itemCode, qty, keterangan}) =>
  request.post(branch_id,'/request/edit/save',{id, itemCode, qty, keterangan});