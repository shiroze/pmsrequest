import request from '~/utils/fetch';

export const getApproval = ({branch_id,start, end}) => request.post(branch_id,'/approval', {start, end});
export const getApprovalbyID = ({branch_id,id}) => request.post(branch_id,'/approval/view', {id});

export const saveApprove = ({branch_id, id, username, stage}) => 
  request.post(branch_id,'/approval/save', {id, username, stage});