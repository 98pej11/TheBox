import axios from 'axios';

const API_BASE_URL = 'https://yourapi.com';

export const postEmailVerification = async (
  loginId: string,
  password: string,
) => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, {
    loginId,
    password,
  });
  return response.data;
};
