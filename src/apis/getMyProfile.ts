import axiosInstance2 from './axiosInstance2';

export const getMyProfile = async () => {
  const response = await axiosInstance2.get(`/my-page`);
  return response.data.data;
};
