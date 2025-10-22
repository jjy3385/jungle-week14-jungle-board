import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';

export default function PostList({ onSelect, selectedPostId }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const limit = Number(process.env.REACT_APP_POSTS_PER_PAGE ?? 5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let active = true;

    (async () => {
      const res = await apiFetch(`/posts?_page=${page}&_limit=${limit}`);
      if (!res.ok) {
        alert('게시글을 불러오지 못했습니다.');
        return;
      }
      const data = await res.json();
      if (!active) return;

      setPosts(data);
      const totalCount = Number(res.headers.get('x-total-count') ?? 0);
      setTotalPages(Math.max(1, Math.ceil(totalCount / limit)));

      if (!selectedPostId && data.length) {
        onSelect(data[0]);
      }
    })();

    return () => {
      active = false;
    };
  }, [page, limit, onSelect, selectedPostId]);

  return (
    <div className="rounded-xl border border-brand-skyBorder bg-white/90 shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-brand-navy">게시판</h3>
        <span className="text-xs text-brand-muted">
          Page {page} / {totalPages}
        </span>
      </div>
      <ul className="space-y-3 text-sm">
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={() => onSelect(post)}
            className={`rounded-lg border px-3 py-2 cursor-pointer transition ${
              selectedPostId === post.id
                ? 'bg-brand-skyLight border-brand-sky'
                : 'bg-white border-brand-skyBorder hover:bg-brand-skyLight'
            }`}
          >
            <p className="font-semibold text-brand-navy">{post.title}</p>
            <p className="text-xs text-brand-muted">by {post.author}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-2 mt-4 text-xs">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-full border border-brand-skyBorder text-brand-navy disabled:opacity-30"
        >
          이전
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-full border border-brand-skyBorder text-brand-navy disabled:opacity-30"
        >
          다음
        </button>
      </div>
    </div>
  );
}
