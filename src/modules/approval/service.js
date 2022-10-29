import request from '~/utils/fetch';

/**
 * API login with email and password
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 */

export const getApproval = () => request.get('/aproval');
export const getApprovalbyID = ({id}) => request.post('/approval', {id});
export const getApprovalDetail = ({id, itemCode}) => request.post('/approval/detail', {id, itemCode});

export const saveApprove = ({id}) => 
  request.post('/approval/save', {id});

export const saveReject = ({id, itemCode}) => request.post('/approval/decline', {id, itemCode});