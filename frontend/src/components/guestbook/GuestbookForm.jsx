import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGuestbook } from '../../context/GuestbookContext';

export default function GuestbookForm() {
  const { user } = useAuth();
  const { postMessage } = useGuestbook();
  const [form, setForm] = useState({
    nickname: '',
    message: '',
    mood: 'happy',
    color: '#ffe5f2',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    try {
      await postMessage({
        author: user?.username ?? (form.nickname || '익명의 방문자'),
        message: form.message,
        mood: form.mood,
        color: form.color,
      });
      setForm((prev) => ({ ...prev, message: '' }));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-brand-skyBorder bg-white p-4 shadow"
    >
      {!user && (
        <input
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="닉네임"
          className="w-full rounded-lg border border-brand-skyBorder bg-white px-3 py-2 text-sm mb-3 text-brand-navy"
        />
      )}

      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="오늘 어떤 일이 있었나요?"
        className="w-full rounded-lg border border-brand-skyBorder bg-white px-3 py-2 text-sm h-24 text-brand-navy"
      />

      <div className="flex justify-between items-center mt-3 text-xs text-brand-muted">
        <div className="flex gap-2 items-center">
          <label>
            기분
            <select
              name="mood"
              value={form.mood}
              onChange={handleChange}
              className="ml-1 rounded border border-brand-skyBorder bg-white text-xs px-1 text-brand-navy"
            >
              <option value="happy">행복</option>
              <option value="sad">우울</option>
              <option value="excited">두근두근</option>
              <option value="angry">화남</option>
            </select>
          </label>
          <label className="flex items-center gap-1">
            배경색
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-6 h-6 border border-brand-skyBorder"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-sky hover:bg-brand-navyLight disabled:bg-brand-skyLight text-white px-4 py-2 rounded-full shadow transition"
        >
          {loading ? '남기는 중...' : '방명록 남기기'}
        </button>
      </div>
    </form>
  );
}
