export const parseJsonResponse = async response => {
  const text = await response.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok || (data && data.success === false)) {
    const errorMsg =
      data?.message || data?.error || `서버 에러 (${response.status})`;

    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};
