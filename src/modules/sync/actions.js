import * as Actions from './constants';

export function SyncData({branch_id}) {
  return {
    type: Actions.SYNC_DATA,
    branch_id
  };
}

export function SyncDownload({branch_id, element}) {
  return {
    type: Actions.SYNC_DOWNLOAD,
    branch_id,
    element
  };
}

export function SyncUpload({branch_id}) {
  return {
    type: Actions.SYNC_UPLOAD,
    branch_id
  };
}

export function SyncStock({branch_id}) {
  return {
    type: Actions.SYNC_STOCK,
    branch_id
  };
}