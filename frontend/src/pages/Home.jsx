import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  //페이지 당 게시글 수
  const limit = 5;

  //로그인 사용자 정보
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/posts?_page=${page}&_limit=${limit}`
        );
        const data = await res.json();
        const totalCount = res.headers.get('x-total-count');
        console.log(totalCount);
        setTotalPages(Math.ceil(totalCount / limit));
        setPosts(data);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">게시판</h1>
        <div>
          {user ? (
            <>
              <span className="mr-4"> {user.username}</span>
              <button onClick={handleLogout} className="text-red-500">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 mr-2"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-green-500"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
      {/* 게시글 작성 버튼 */}
      {user && (
        <button
          onClick={() => navigate('/write')}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          글쓰기
        </button>
      )}
      {/* 게시글 목록 */}
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="border p-3 rounded">
            <Link to={`/posts/${post.id}`} className="text-lg font-bold">
              {post.title}
            </Link>
            <p className="text-sm text-gray-600">작성자: {post.author}</p>
          </li>
        ))}
      </ul>
      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ◀ 이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}
export default Home;
