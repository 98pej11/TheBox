import {accountStore} from '../stores/accountStore';
import axiosInstance1 from './axiosInstance1';

export const getFriendList = async () => {
  console.log('🔑 Access Token:', accountStore.accessToken);
  const response = await axiosInstance1.get(`/friends/`);
  return response.data;
};
