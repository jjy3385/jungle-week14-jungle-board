import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    const res = await apiFetch(`/comments/${postId}`);
    if (!res.ok) {
      alert('댓글을 불러오지 못했습니다.');
      return;
    }
    setComments(await res.json());
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const res = await apiFetch(`/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchComments();
    } else {
      alert('본인 댓글만 삭제할 수 있습니다.');
    }
  };

  const handleEdit = async (id) => {
    const res = await apiFetch(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content: editContent }),
    });
    if (res.ok) {
      setEditingId(null);
      fetchComments();
    } else {
      alert('댓글 수정에 실패했습니다.');
    }
  };
  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2 text-brand-navy">
        댓글 {comments.length}개
      </h3>
      {comments.map((c) => (
        <div
          key={c.id}
          className="border border-brand-skyBorder rounded p-2 mb-2 bg-brand-skyLight/40 flex flex-col"
        >
          <div className="flex justify-between">
            <span className="font-semibold text-brand-navyLight">
              {c.author}
            </span>
            <span className="text-sm text-brand-muted">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>

          {editingId === c.id ? (
            <>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border border-brand-skyBorder w-full p-1 mt-2 text-brand-navy"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c.id)}
                  className="text-white bg-brand-sky px-2 py-1 rounded"
                >
                  수정완료
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-white bg-brand-muted px-2 py-1 rounded"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-brand-navy">{c.content}</p>
              {user && user.username === c.author && (
                <div className="flex gap-2 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditContent(c.content);
                    }}
                    className="text-brand-navyLight"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-brand-muted"
                  >
                    삭제
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
