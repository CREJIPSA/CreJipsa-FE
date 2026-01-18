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
