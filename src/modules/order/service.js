import request from '~/utils/fetch';

/**
 * API login with email and password
 * @param username
 * @param password
 * @returns {Promise<unknown>}
 */

export const saveRequest = ({username, data}) => 
  request.post('/request/save', {username, data});