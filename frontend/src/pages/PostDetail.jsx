import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`/posts/${id}`);
      if (!res.ok) {
        alert('게시글을 불러오지 못했습니다.');
        navigate();
        return;
      }
      setPost(await res.json());
    })();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const res = await apiFetch(`/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('삭제되었습니다.');
      navigate('/');
    } else if (res.status === 403) {
      alert('본인 글만 삭제할 수 있습니다.');
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  if (!post) return <div>로딩중...</div>;

  const canEdit = user && user.username === post.author;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-sm text-gray-500">작성자: {post.author}</p>

      {canEdit && (
        <div className="mt-4 space-x-2">
          <button
            onClick={() => navigate(`/edit/${post.id}`)}
            className="bg-yellow-400 text-white px-3 py-1 rounded"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            삭제
          </button>
        </div>
      )}
      <hr className="my-4" />
      {/* 댓글 입력/목록 */}
      <CommentForm
        postId={post.id}
        onCommentAdded={() => setRefreshKey((k) => k + 1)}
      />
      <CommentList key={refreshKey} postId={post.id} />
    </div>
  );
}

export default PostDetail;
