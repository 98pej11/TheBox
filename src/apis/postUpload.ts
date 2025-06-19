import axiosInstance1 from './axiosInstance1';
import axios from 'axios';

interface PostData {
  content: {
    contentType: string; // 필수: 'IMAGE' 또는 'VIDEO' 등
    contentUrl: string; // 필수: S3 URL
  };
  location?: {
    // 옵션
    locationName: string;
    latitude: number;
    longitude: number;
  };
  text?: string; // 옵션
  tagIds?: number[]; // 옵션
  categories?: string[]; // 옵션
}

export const postUpload = async (request: PostData) => {
  try {
    console.log(request);
    const response = await axiosInstance1.post(`/posts/create`, {
      data: request,
    });

    console.log('✅ 성공적인 응답:', response.data);
    return response.data;
  } catch (error: any) {
    console.log('=== 에러 분석 ===');
    console.log('상태 코드:', error.response?.status);
    console.log('에러 메시지:', error.response?.data);
    console.log('허용된 메소드:', error.response?.headers?.allow);
    console.log('전체 응답 헤더:', error.response?.headers);

    // 400 에러 (Bad Request) 처리
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      if (errorData?.error?.includes('Missing required field')) {
        console.error('🚨 필수 필드 누락:', errorData.error);
        throw new Error(`필수 필드가 누락되었습니다: ${errorData.error}`);
      }
    }

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

// 유틸리티 함수 - contentType 결정
export const getContentType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'IMAGE';
  } else if (mimeType.startsWith('video/')) {
    return 'VIDEO';
  } else {
    return 'IMAGE'; // 기본값
  }
};
