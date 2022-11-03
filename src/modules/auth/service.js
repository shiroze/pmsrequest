import request from '~/utils/fetch';

/**
 * API login with email and password
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 */
export const login = ({branch_id, username, password}) =>
  request.post(branch_id,'/login', {username, password});

/**
 * We Don't need logout because not save anything
 * Clear State reducer
 */
// export const logout = () => request.get('/logout');
