import * as SecureStore from 'expo-secure-store';

let refreshingPromise = null;

let getAccessToken = () => null;
let setAccessToken = () => {};
let logout = () => {};

export function initAuthFetch({ getToken, setToken, onLogout }) {
  getAccessToken = getToken;
  setAccessToken = setToken;
  logout = onLogout;
}

async function refreshAccessToken() {
  console.log('[authFetch] refreshing start');

  const userIdStr = await SecureStore.getItemAsync('userId');
  const userId = userIdStr ? Number(userIdStr) : null;
  if (!userId) {
    console.log('[authFetch] no userId found');
    throw new Error('No userId');
  }

  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) {
    console.log('[authFetch] no refresh token found');
    throw new Error('No refreshToken');
  }

  const res = await fetch('https://dev.crezipsa.site/api/auth/refreshToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, refreshToken }),
  });

  console.log('[authFetch] refresh status', res.status);

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  const newAccessToken = data?.result?.accessToken;
  if (!newAccessToken) throw new Error('No accessToken in refresh response');

  return newAccessToken;
}

function isAbortError(e) {
  const msg = String(e?.message || e);
  return e?.name === 'AbortError' || msg.includes('Aborted');
}

export async function authFetch(url, options = {}) {
  console.log('[authFetch] request', options?.method || 'GET', url);

  const token = getAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  console.log('[authFetch] response status', res.status);

  if (res.status !== 401) return res;

  console.log('[authFetch] received 401 -> try refresh');

  try {
    if (!refreshingPromise) {
      refreshingPromise = refreshAccessToken()
        .then(async newAccessToken => {
          console.log(
            '[authFetch] refresh success new access head',
            newAccessToken.slice(0, 20),
          );
          setAccessToken(newAccessToken);
          await SecureStore.setItemAsync('accessToken', newAccessToken); // accessToken 저장
          return newAccessToken;
        })
        .finally(() => {
          refreshingPromise = null;
        });
    }

    const newToken = await refreshingPromise;

    console.log('[authFetch] retrying original request with new token');

    try {
      const retryRes = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
      return retryRes;
    } catch (e) {
      if (isAbortError(e)) {
        console.log('[authFetch] retry aborted (ignore logout)');
        throw e;
      }
      throw e;
    }
  } catch (error) {
    if (isAbortError(error)) {
      console.log('[authFetch] aborted -> do not logout');
      throw error;
    }

    console.log(
      '[authFetch] refresh failed -> logout',
      error?.message || error,
    );

    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    logout();
    throw error;
  }
}
