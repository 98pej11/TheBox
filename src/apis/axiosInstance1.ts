import axios from 'axios';
import {accountStore} from '../stores/accountStore';

const axiosInstance1 = axios.create({
  baseURL: 'http://43.203.49.193:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance1.interceptors.request.use(config => {
  const token = accountStore.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance1;
