import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

function PostWrite() {
  const { values, handleChange, reset } = useForm({
    title: '',
    content: '',
  });
  const navigate = useNavigate();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && !user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [initializing, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (res.ok) {
      alert('게시글이 등록되었습니다.');
      reset();
      navigate('/');
    } else {
      alert('게시글 등록에 실패했습니다.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-96 mx-auto mt-20"
    >
      <input
        type="text"
        name="title"
        placeholder="제목"
        value={values.title}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <textarea
        name="content"
        placeholder="내용"
        value={values.content}
        onChange={handleChange}
        className="border p-2 rounded h-40"
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        등록
      </button>
    </form>
  );
}

export default PostWrite;
