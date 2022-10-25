import request from '~/utils/fetch';

/**
 * API login with email and password
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 */
export const login = ({username, password}) =>
  request.post('/login', {username, password});

export const logout = () => request.get('/logout');
