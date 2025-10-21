import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  //로그인 사용자 정보
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`http://localhost:4000/posts/${id}`, { method: 'DELETE' });
    alert('삭제되었습니다.');
    navigate('/');
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
