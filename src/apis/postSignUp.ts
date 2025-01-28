import axios from 'axios';

const API_BASE_URL =
  'http://ec2-54-180-103-157.ap-northeast-2.compute.amazonaws.com:8080';

export const postSignUp = async (
  loginId: string,
  password: string,
  firstName: string,
  lastName: string,
  birthDate: Date,
) => {
  const response = await axios.post(`${API_BASE_URL}/users`, {
    loginId,
    password,
    firstName,
    lastName,
    birthDate,
  });
  return response.data;
};
