// S3에 이미지 업로드하는 공통 함수
export const uploadImageToS3 = async (
  imageUri: string, // 이미지 파일의 로컬 URI
  fileName: string, // 업로드할 파일명
  fileSize: number, // 파일 크기 (바이트 단위)
  mimeType: string, // MIME 타입
  uploadType: string, // 업로드 카테고리
  getPreSignedUrlFn: Function,
) => {
  try {
    // 1단계: Pre-signed URL 받기
    const {filePath, preSignedUrl} = await getPreSignedUrlFn(
      fileName,
      fileSize,
      uploadType,
    );

    if (!filePath || !preSignedUrl) {
      throw new Error('Pre-signed URL 요청 실패');
    }

    if (!imageUri) {
      throw new Error('이미지 URI가 없습니다');
    }

    // 2단계: 이미지를 blob으로 변환
    const fetchResponse = await fetch(imageUri);
    const blob = await fetchResponse.blob();

    // 3단계: S3에 업로드
    const response = await fetch(preSignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileSize.toString(),
      },
      body: blob,
    });

    // 4단계: 업로드 결과 확인
    if (response.status === 200) {
      console.log('File uploaded successfully');
      return filePath;
    } else {
      throw new Error(`Failed to upload file. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error during file upload:', error);
    throw error;
  }
};
