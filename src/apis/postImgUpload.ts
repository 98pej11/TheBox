import axiosInstance2 from './axiosInstance2';

export const postImgUpload = async (
  fileName: string = '', // 기본값을 빈 문자열로 설정
  fileSize: number = 0, // 기본값을 0으로 설정
  fileType: string = '', // 기본값을 빈 문자열로 설정
) => {
  console.log(fileName, fileSize, fileType);

  const response = await axiosInstance2.post(`/files/pre-signed-url`, {
    fileName,
    fileSize,
    fileType,
  });
  console.log(response);
  return response.data.data;
};
