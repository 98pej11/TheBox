import axiosInstance1 from './axiosInstance1';

export const getPost = async (tab: string) => {
  console.log('Requesting tab:', tab);
  try {
    const response = await axiosInstance1.get(`/post/?tab=${tab}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};
