export const getMimeTypeFromPath = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    case 'heic':
      return 'image/heic';
    default:
      return 'image/jpeg';
  }
};

export const generateFileName = (mimeType: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);

  let extension: string;
  let prefix: string;

  if (mimeType.startsWith('image/')) {
    prefix = 'photo';
    switch (mimeType) {
      case 'image/jpeg':
        extension = 'jpg';
        break;
      case 'image/png':
        extension = 'png';
        break;
      case 'image/gif':
        extension = 'gif';
        break;
      case 'image/webp':
        extension = 'webp';
        break;
      case 'image/heic':
        extension = 'heic';
        break;
      default:
        extension = 'jpg';
    }
  } else if (mimeType.startsWith('video/')) {
    prefix = 'video';
    switch (mimeType) {
      case 'video/mp4':
        extension = 'mp4';
        break;
      case 'video/quicktime':
        extension = 'mov';
        break;
      case 'video/x-msvideo':
        extension = 'avi';
        break;
      default:
        extension = 'mp4';
    }
  } else {
    prefix = 'file';
    extension = 'jpg';
  }

  return `${prefix}_${timestamp}_${randomString}.${extension}`;
};
