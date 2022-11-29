import * as Actions from './constants';

export function issueOrder({branch_id, id, username}) {
  return {
    type: Actions.ISSUE_ORDER,
    branch_id, id, username
  };
}


export function localIssueOrder({id, username}) {
  return {
    type: Actions.LOCAL_ISSUE_ORDER,
    id, username
  };
}