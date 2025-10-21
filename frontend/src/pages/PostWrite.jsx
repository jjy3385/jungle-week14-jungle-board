import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

function PostWrite() {
  const { values, handleChange, reset } = useForm({
    title: '',
    content: '',
  });
  const navigate = useNavigate();

  // 로그인 사용자 정보
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('로그인 후 이용해주세요.');
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { ...values, author: user.username };

    const res = await fetch('http://localhost:4000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (res.ok) {
      alert('게시글이 등록되었습니다.');
      reset();
      navigate('/');
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
