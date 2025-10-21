import { useEffect, useState } from 'react';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 로그인 사용자 정보
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:4000/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`http://localhost:4000/comments/${id}`, { method: 'DELETE' });
    fetchComments();
  };

  const handleEdit = async (id) => {
    await fetch(`http://localhost:4000/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    });
    setEditingId(null);
    fetchComments();
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">댓글 {comments.length}개</h3>
      {comments.map((c) => (
        <div
          key={c.id}
          className="border rounded p-2 mb-2 bg-gray-50 flex flex-col"
        >
          <div className="flex justify-between">
            <span className="font-semibold">{c.author}</span>
            <span className="text-sm text-grey-500">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>

          {editingId === c.id ? (
            <>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border w-full p-1 mt-2"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c.id)}
                  className="text-white bg-green-500 px-2 py-1 rounded"
                >
                  수정완료
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-white bg-gray-400 px-2 py-1 rounded"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2">{c.content}</p>
              {/* 로그인 유저 == 작성자 일 때만 버튼 보이기 */}
              {user && user.username === c.author && (
                <div className="flex gap-2 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditContent(c.content);
                    }}
                    className="text-blue-500"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500"
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

export default CommentList;
