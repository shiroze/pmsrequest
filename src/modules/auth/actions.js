import * as Actions from './constants';

/**
 * Action login
 * @param username
 * @param password
 * @return {{username: *, roles: *}}
 */
export function signIn({branch_id,username, password}) {
  return {
    type: Actions.SIGN_IN,
    username,
    password,
    branch_id,
  };
}

export function localSignIn({branch_id, username, password}) {
  return {
    type: Actions.LOCAL_SIGN_IN,
    branch_id,
    username,
    password,
  };
}

export function signOut({expired}) {
  return {
    type: Actions.SIGN_OUT,
    expired
  }
}