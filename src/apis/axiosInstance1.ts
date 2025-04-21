import axios from 'axios';
import {accountStore} from '../stores/accountStore'; // accessToken을 가져오는 부분

const axiosInstance1 = axios.create({
  baseURL: 'http://43.203.49.193:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛠️ 요청 인터셉터 (API 요청 로그 출력)
axiosInstance1.interceptors.request.use(
  config => {
    const token = accountStore.accessToken;

    console.log('🚀 [API 요청 시작]');
    console.log('📝 Method:', config.method?.toUpperCase());
    console.log('📡 Headers:', config.headers);
    console.log('📄 Data:', config.data);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Authorization 추가됨:', config.headers.Authorization);
    } else {
      console.warn('⚠️ Authorization 토큰 없음!');
    }

    return config;
  },
  error => {
    console.error('❌ 요청 인터셉터 오류:', error);
    return Promise.reject(error);
  },
);

axiosInstance1.interceptors.response.use(
  response => {
    console.log('✅ [API 응답 성공]:', response);
    return response;
  },
  error => {
    console.error('❌ [API 요청 오류]:', error);

    if (error.response) {
      console.error('📌 서버 응답 상태:', error.response.status);
      console.error('📌 서버 응답 데이터:', error.response.data);
      console.error('📌 응답 헤더:', error.response.headers);
    } else if (error.request) {
      console.error('📌 요청은 갔지만 응답 없음:', error.request);
    } else {
      console.error('📌 요청 설정 오류:', error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance1;
