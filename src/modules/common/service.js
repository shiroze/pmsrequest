import request from '~/utils/fetch';

/**
 * API login with email and password
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 */
export const login = ({username, password}) =>
  request.post('/login', {username, password});

export const loadItemGroup = () => request.get('/item_group');
export const loadSubGroup = ({groupName}) => request.post('/item_subgroup', {groupName});

export const getMaterial = ({groupName, subgroupName, query, start, end}) => 
  request.post('/getMaterial', {groupName, subgroupName, query, start, end});

export const getMaterialbyID = ({groupCode}) => 
  request.post('/getMaterialbyID', {groupCode});

export const getHistory = ({start, end, date_from, date_to}) => request.post('/getHistory', {start, end, date_from, date_to});
export const getHistorybyID = ({id}) => request.post('/getHistorybyID', {id});