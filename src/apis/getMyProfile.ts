import axios from 'axios';

const API_BASE_URL =
  'http://ec2-54-180-103-157.ap-northeast-2.compute.amazonaws.com:8080';

export const getMyProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/my-page`, {
    headers: {
      Authorization: `Bearer NWEwYWI0ODQtOGI1MS00Y2NiLTg0YzgtNGRkOGQzYjI0MWFlOkVCaVlBQnUwVXR5R3FyV1puaEhLS3pNTURha0lfRUc1SUJ5QkxicEdfOG8=`,
    },
  });
  return response.data;
};
