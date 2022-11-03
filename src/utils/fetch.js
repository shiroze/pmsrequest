import {isImmutable} from 'immutable';

import configApi from '~/config/api';
import reactotron from 'reactotron-react-native';
import Axios from 'axios';

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @return {Promise<R>}
 */
const get = (branch_id, url, data, method = 'POST') => {
  return new Promise((resolve, reject) => {
    let baseURL = configApi.API_ENDPOINT + '/' + branch_id + configApi.ENDPOINT + url;
    Axios({
      method: 'get',
      url: baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((result) => {
        if (result.success) {
          resolve(result);
        } else {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @return {Promise<R>}
 */
const post = (branch_id, url, data, method = 'POST') => {
  return new Promise((resolve, reject) => {
    let baseURL = configApi.API_ENDPOINT + '/' + branch_id + configApi.ENDPOINT + url;
    Axios({
      method: 'post',
      url: baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: typeof data === 'object' ? JSON.stringify(data) : null,
    })
      .then((result) => {
        if (result.success) {
          resolve(result);
        } else {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  get,
  post,
  put: (url, data) => post(url, data, 'PUT'),
};
