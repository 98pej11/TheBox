import axios from 'axios';

const API_BASE_URL = 'https://yourapi.com';

export const postEmailVerification = async (
  email: string,
  verificationCode: string,
) => {
  const response = await axios.post(
    `${API_BASE_URL}/verifications/email/verify`,
    {
      email,
      verificationCode,
    },
  );
  return response.data;
};
