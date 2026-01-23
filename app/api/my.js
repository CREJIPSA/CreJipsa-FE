import { authFetch } from '@/lib/authFetch.js';
import { parseJsonResponse } from './utils.js';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchMyPosts = async (params, accessToken) => {
  const { page = 0, size = 10, field, sort } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (field && field !== '전체') {
    queryParams.append('field', field);
  }

  if (sort) {
    queryParams.append('sort', sort);
  }

  const url = `${API_BASE_URL}/community/my?${queryParams.toString()}`;

  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await parseJsonResponse(response);
};

export const fetchMyLikes = async (params, accessToken) => {
  const { page = 0, size = 10, field, sort } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (field && field !== '전체') {
    queryParams.append('field', field);
  }

  if (sort) {
    queryParams.append('sort', sort);
  }

  const url = `${API_BASE_URL}/likes/me?${queryParams.toString()}`;

  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await parseJsonResponse(response);
};

export const fetchMyComments = async (params, accessToken) => {
  const { page = 0, size = 10, field } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (field && field !== '전체') {
    queryParams.append('field', field);
  }

  const url = `${API_BASE_URL}/comment/my?${queryParams.toString()}`;

  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await parseJsonResponse(response);
};

export const deletePost = async (communityId, accessToken) => {
  const url = `${API_BASE_URL}/community/${communityId}`;

  const response = await authFetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await parseJsonResponse(response);
};

export const fetchMe = async accessToken => {
  const url = `${API_BASE_URL}/user/me`;

  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const updateMe = async (channelData, accessToken) => {
  const url = `${API_BASE_URL}/user/update`;

  const response = await authFetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(channelData),
  });

  return await parseJsonResponse(response);
};

export const deleteChannel = async (platform, accessToken) => {
  const url = `${API_BASE_URL}/user/update?platform=${platform.toUpperCase()}`;

  const response = await authFetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const getMyInterest = async accessToken => {
  const url = `${API_BASE_URL}/user/interest`;

  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const addInterest = async (category, accessToken) => {
  const url = `${API_BASE_URL}/user/interest/${encodeURIComponent(category)}`;

  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const deleteInterest = async (interestId, accessToken) => {
  const url = `${API_BASE_URL}/user/interest/${interestId}`;

  const response = await authFetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const deleteMe = async accessToken => {
  const url = `${API_BASE_URL}/user/me`;

  const response = await authFetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseJsonResponse(response);
};

export const fetchMyTrends = async accessToken => {
  const url = `${API_BASE_URL}/main/trend/getUserTrend`;
  const response = await authFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  return await parseJsonResponse(response);
};
