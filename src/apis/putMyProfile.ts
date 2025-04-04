import axiosInstance2 from './axiosInstance2';

export const putMyProfile = async (
  profileImageUrl: string,
  profileMessage: string,
  profileLink: string,
) => {
  const response = await axiosInstance2.put(`/my-page`, {
    profileImageUrl,
    profileMessage,
    profileLink,
  });
  return response.data;
};
