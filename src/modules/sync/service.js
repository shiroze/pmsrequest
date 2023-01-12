import request from '~/utils/fetch';

export const Sync_Stock = ({branch_id}) => request.get(branch_id,'/sync_stock');

export const Sync_Data = ({branch_id, APIURL}) => request.get(branch_id,`/${APIURL}`);

export const Post_Data = ({branch_id, APIURL, data}) => request.post(branch_id,`/${APIURL}`, data);