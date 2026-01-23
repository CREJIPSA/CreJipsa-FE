import { parseJsonResponse } from './utils.js';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const getPresignedUrl = async (fileName, contentType, token) => {
  const encodedFileName = encodeURIComponent(fileName);
  const encodedContentType = encodeURIComponent(contentType);

  const url = `${API_BASE_URL}/files/upload?fileName=${encodedFileName}&contentType=${encodedContentType}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const uploadFileToS3 = async (uploadUrl, uri, contentType) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': contentType,
      'x-amz-acl': 'public-read',
    },
  });
};
