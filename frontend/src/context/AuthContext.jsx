import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  //앱 시작 시 사용자 정보 읽기
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await apiFetch('/users/me');
        if (!active) return;

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401) {
          setUser(null);
        } else {
          console.error('Failed to fetch session info', res.status);
        }
      } catch (error) {
        console.error('Error fetching session info', error);
        if (active) setUser(null);
      } finally {
        if (active) setInitializing(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [setInitializing]);

  const login = useCallback(async (credentials) => {
    const res = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail ?? '로그인 실패');
    }

    const me = await apiFetch('/users/me');
    if (me.ok) {
      setUser(await me.json());
    } else {
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiFetch('/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
