import axios from 'axios';
import {UserInfo} from '../types/accountTypes';

const API_BASE_URL =
  'http://ec2-54-180-103-157.ap-northeast-2.compute.amazonaws.com:8080';

export const postSignUp = async (
  loginId: string,
  password: string,
  userInfo: UserInfo,
) => {
  const response = await axios.post(`${API_BASE_URL}/users/sign-up`, {
    loginId,
    password,
    userInfo,
  });
  return response.data;
};
