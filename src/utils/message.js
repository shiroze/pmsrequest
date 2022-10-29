import {showMessage} from 'react-native-flash-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export function handleError(e) {
  showMessage({
    // message: e.code,
    message: e.message,
    // description: e.message,
    type: 'danger',
    duration: 3000,
    statusBarHeight: getStatusBarHeight()
  });
}

export function handleSuccess(e) {
  showMessage({
    // message: e.code,
    message: e.message,
    // description: e.message,
    type: 'success',
    statusBarHeight: getStatusBarHeight()
  });
}

export function handleWarning(e) {
  showMessage({
    // message: e.code,
    message: e.message,
    // description: e.message,
    type: 'warning',
    duration: 3000,
    statusBarHeight: getStatusBarHeight()
  });
}


export function handleInfo(e) {
  showMessage({
    // message: e.code,
    message: e.message,
    // description: e.message,
    type: 'info',
    duration: 3000,
  });
}

export function notificationMessage(data) {
  const type = data && data.type ? data.type : 'error';
  const message = data && data.message ? data.message : 'Fail';
  const errors = data && data.errors ? data.errors : {};
  return {
    type,
    message,
    errors,
  };
}