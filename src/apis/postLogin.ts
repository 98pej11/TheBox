import axios from 'axios';

const API_BASE_URL =
  'http://ec2-54-180-103-157.ap-northeast-2.compute.amazonaws.com:8080';

export const postLogin = async (loginId: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/users/sign-in`, {
    loginId,
    password,
  });
  return response.data.data;
};
