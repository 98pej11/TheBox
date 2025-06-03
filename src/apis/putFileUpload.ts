import axiosInstance1 from './axiosInstance1';

export const putFileUpload = async (
  fileName: string = '', // 기본값을 빈 문자열로 설정
  fileSize: number = 0, // 기본값을 0으로 설정
  fileType: string = '', // 기본값을 빈 문자열로 설정
) => {
  console.log(fileName, fileSize, fileType);

  const response = await axiosInstance1.put(`/posts/files/presigned-url`, {
    fileName,
    fileSize,
    fileType,
  });
  console.log(response.data.data);
  return response.data.data;
};
