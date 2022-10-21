import * as Actions from './constants';

/**
 * Action login
 * @param username
 * @param password
 * @return {{username: *, roles: *}}
 */
export function signIn({username, password}) {
  return {
    type: Actions.SIGN_IN,
    username,
    password,
  };
}