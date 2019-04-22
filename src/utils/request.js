import axios from 'axios';
import qs from 'qs';

const request = axios.create({
  baseURL: 'http://mock.mioji.com/mock/5cbd5c997cc642513f2e2962/TravelTalk',
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
  responseType: 'json',
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

export default request;