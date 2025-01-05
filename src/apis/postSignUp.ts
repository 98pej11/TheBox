import axios from 'axios';

const API_BASE_URL = 'https://yourapi.com';

export const postEmailVerification = async (
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
    birthDate
  });
  return response.data;
};
