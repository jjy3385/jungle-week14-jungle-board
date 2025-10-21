import { useState } from 'react';

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');

  //로그인 사용자 정보
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!user) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    const newComment = {
      postId,
      author: user.username,
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:4000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error('댓글 등록 실패');

      setContent('');
      onCommentAdded(); //댓글 목록 새로고침
    } catch (err) {
      console.error(err);
      alert('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="w-full border rounded p-2"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        등록
      </button>
    </form>
  );
}

export default CommentForm;
