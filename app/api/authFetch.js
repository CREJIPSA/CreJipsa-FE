import * as SecureStore from 'expo-secure-store';

let getAccessToken = () => null;
let setAccessToken = () => {};
let logout = () => {};

export function initAuthFetch({ getToken, setToken, onLogout }) {
  getAccessToken = getToken;
  setAccessToken = setToken;
  logout = onLogout;
}

async function refreshAccessToken() {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const res = await fetch(`https://dev.crezipsa.site/api/auth/refreshToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return data.result.accessToken;
}

export async function authFetch(url, options = {}) {
  const token = getAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // 정상 응답이면 그대로 반환
  if (res.status !== 401) {
    return res;
  }

  // 401 Unauthorized 응답이면 토큰 갱신 시도
  try {
    const newToken = await refreshAccessToken();
    setAccessToken(newToken);

    // 갱신된 토큰으로 원래 요청 재시도
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      },
    });
  } catch (error) {
    // 토큰 갱신 실패 시 로그아웃 처리
    logout();
    throw error;
  }
}
