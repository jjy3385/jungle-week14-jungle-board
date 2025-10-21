const API_BASE = process.env.REACT_APP_API_BASE ?? 'http://localhost:8000';

export const apiFetch = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });
};
