import axiosInstance1 from './axiosInstance1';

export const deleteFriend = async (id: number) => {
  const response = await axiosInstance1.delete(`/friends/${id}`);
  return response.data;
};
