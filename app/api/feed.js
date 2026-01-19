const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchCommunityPosts = async (field = 'RECOMMEND', accessToken) => {
  const url = `${API_BASE_URL}/community/filter?field=${field}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
};

export const fetchPostDetail = async (communityId, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/community/${communityId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await response.json();
};

export const getPresignedUrl = async (fileName, contentType, token) => {
  // 슬래시(/) 등 특수문자가 포함된 파라미터를 안전하게 인코딩합니다.
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

  return await response.json();
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

export const createPost = async (postData, accessToken) => {
  const response = await fetch(`${API_BASE_URL}/community/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(postData),
  });
  return await response.json();
};
