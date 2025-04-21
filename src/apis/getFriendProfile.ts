import axiosInstance2 from './axiosInstance2';

export const getFriendProfile = async (id: number) => {
  const response = await axiosInstance2.get(`/friend-page/${id}`);
  return response.data.data;
};
