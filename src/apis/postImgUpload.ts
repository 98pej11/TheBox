import axios from 'axios';

const API_BASE_URL =
  'http://ec2-54-180-103-157.ap-northeast-2.compute.amazonaws.com:8080';

export const postImgUpload = async (
  fileName: string = '', // 기본값을 빈 문자열로 설정
  fileSize: number = 0, // 기본값을 0으로 설정
  fileType: string = '', // 기본값을 빈 문자열로 설정
) => {
  // 값이 없으면 기본값을 할당하여 API 요청
  if (!fileName || !fileSize || !fileType) {
    return; // 필수 값이 없으면 요청하지 않음
  }

  const response = await axios.post(
    `${API_BASE_URL}/files/pre-signed-url`,
    {
      fileName,
      fileSize,
      fileType,
    },
    {
      headers: {
        Authorization: `Bearer NWEwYWI0ODQtOGI1MS00Y2NiLTg0YzgtNGRkOGQzYjI0MWFlOkVCaVlBQnUwVXR5R3FyV1puaEhLS3pNTURha0lfRUc1SUJ5QkxicEdfOG8=`,
      },
    },
  );
  return response.data;
};
