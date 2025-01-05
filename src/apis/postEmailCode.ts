import axios from 'axios';

const API_BASE_URL = 'https://yourapi.com';

export const postEmailVerification = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/verifications/email`, {
    email,
  });
  return response.data;
};
