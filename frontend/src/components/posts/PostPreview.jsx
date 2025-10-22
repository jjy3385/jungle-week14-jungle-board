import { useNavigate } from 'react-router-dom';
import CommentForm from '../CommentForm';
import CommentList from '../CommentList';
import { useAuth } from '../../context/AuthContext';

export default function PostPreview({ post }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!post) {
    return (
      <div className="rounded-xl border border-brand-skyBorder bg-white/90 shadow p-4 text-sm text-center text-brand-muted">
        게시글을 선택해 주세요.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-skyBorder bg-white/90 shadow p-4 space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-brand-navy">{post.title}</h3>
        <p className="text-xs text-brand-muted">by {post.author}</p>
        <hr className="my-3 border-brand-skyBorder" />
        <p className="text-sm text-brand-navy whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>
      <div className="flex gap-2 text-xs">
        {user?.username === post.author && (
          <>
            <button
              onClick={() => navigate(`/edit/${post.id}`)}
              className="px-3 py-1 rounded-full border border-brand-skyBorder text-brand-navyLight"
            >
              수정
            </button>
            <button
              onClick={() => navigate(`/posts/${post.id}`)}
              className="px-3 py-1 rounded-full border border-brand-skyBorder text-brand-navy"
            >
              상세보기
            </button>
          </>
        )}
        <button
          onClick={() => navigate(`/posts/${post.id}`)}
          className="px-3 py-1 rounded-full border border-brand-skyBorder text-brand-navy"
        >
          댓글 더보기
        </button>
      </div>
      <div className="space-y-3">
        <CommentForm postId={post.id} onCommentAdded={() => {}} />
        <CommentList postId={post.id} />
      </div>
    </div>
  );
}
