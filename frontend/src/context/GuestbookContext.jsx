import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { apiFetch } from '../api/client';

const GuestbookContext = createContext(null);
export function GuestbookProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [connecting, setConnecting] = useState(true);
  const limit = 50;

  const loadInitial = useCallback(async () => {
    const res = await apiFetch(`/guestbook?limit=${limit}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    const base = process.env.REACT_APP_WS_BASE ?? 'ws://localhost:8000';
    const socket = new WebSocket(`${base}/ws/guestbook`);
    socket.onopen = () => setConnecting(false);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'guestbook:new') {
        setMessages((prev) => [payload.data, ...prev].slice(0, limit));
      }
    };
    socket.onerror = () => setConnecting(false);
    return () => socket.close();
  }, []);

  const postMessage = useCallback(async (body) => {
    const res = await apiFetch('/guestbook', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail ?? '방명록 등록 실패');
    }
  }, []);

  return (
    <GuestbookContext.Provider value={{ messages, postMessage, connecting }}>
      {children}
    </GuestbookContext.Provider>
  );
}
export function useGuestbook() {
  const ctx = useContext(GuestbookContext);
  if (!ctx)
    throw new Error('useGuestbook must be used inside GuestbookProvider');
  return ctx;
}
