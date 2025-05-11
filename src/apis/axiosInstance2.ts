import axios from 'axios';
import {accountStore} from '../stores/accountStore';

const axiosInstance2 = axios.create({
  baseURL:
    'http://ec2-54-180-103-157.ap-northeast-2.compute.amazonaws.com:8080', // 서버 2
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance2.interceptors.request.use(config => {
  const token = accountStore.accessToken;
  // console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance2;
