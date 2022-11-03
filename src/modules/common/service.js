import request from '~/utils/fetch';

export const loadItemGroup = ({branch_id}) => request.get(branch_id,'/item_group');
export const loadSubGroup = ({branch_id,groupName}) => request.post(branch_id,'/item_subgroup', {groupName});

export const getMaterial = ({branch_id,groupName, subgroupName, query, start, end}) => 
  request.post(branch_id,'/getMaterial', {groupName, subgroupName, query, start, end});

export const getMaterialbyID = ({branch_id,groupCode}) => 
  request.post(branch_id,'/getMaterialbyID', {groupCode});

export const searchMaterial = ({branch_id, query, start, end}) =>
  request.post(branch_id, '/searchMaterial', {query, start, end});

export const getHistory = ({branch_id,start, end, date_from, date_to}) => request.post(branch_id,'/getHistory', {start, end, date_from, date_to});
export const getHistorybyID = ({branch_id,id}) => request.post(branch_id,'/getHistorybyID', {id});