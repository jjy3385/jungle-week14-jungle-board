const API_BASE = process.env.REACT_APP_API_BASE ?? 'http://localhost:8000';

export const apiFetch = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    // 세션 쿠키를 함께 보내기
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });
};
