import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const res = await apiFetch('/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content }),
    });
    if (!res.ok) {
      alert('댓글 등록에 실패했습니다.');
      return;
    }

    setContent('');
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="w-full border border-brand-skyBorder rounded p-2 text-brand-navy"
      />
      <button
        type="submit"
        className="mt-2 bg-brand-sky hover:bg-brand-navyLight text-white px-3 py-1 rounded transition"
      >
        등록
      </button>
    </form>
  );
}
