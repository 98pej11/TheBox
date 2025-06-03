import axiosInstance1 from './axiosInstance1';
import axios from 'axios';

interface PostData {
  contentUrl: string;
  // location: {
  //   locationName: string;
  //   latitude: number;
  //   longitude: number;
  // };
  text: string;
  tagIds: number[];
  categories: string[];
}

export const postUpload = async (request: PostData) => {
  try {
    const response = await axiosInstance1.post(`/posts/`, request);

    console.log('✅ 성공적인 응답:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ API 요청 오류 발생:', error);

    if (axios.isAxiosError(error)) {
      console.error('📌 Axios 오류 메시지:', error.message);

      if (error.response) {
        console.error(
          '⚠️ 서버 응답 오류:',
          error.response.status,
          error.response.data,
        );
      } else if (error.request) {
        console.error('⚠️ 요청은 갔으나 응답 없음:', error.request);
      }
    } else if (error instanceof Error) {
      console.error('📌 일반 오류 메시지:', error.message);
    } else {
      console.error('📌 알 수 없는 오류 발생:', error);
    }

    throw error;
  }
};
