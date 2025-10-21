import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../hooks/useForm';

function PostEdit() {
  const { id } = useParams();
  const { values, handleChange, reset } = useForm({ title: '', content: '' });
  const navigate = useNavigate();

  //로그인 사용자 정보
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:4000/posts/${id}`);
        const data = await res.json();
        reset(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:4000/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, author: user.username }),
    });

    alert('수정되었습니다.');
    navigate(`/posts/${id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-96 mx-auto mt-20"
    >
      <input
        type="text"
        name="title"
        value={values.title}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <textarea
        name="content"
        value={values.content}
        onChange={handleChange}
        className="border p-2 rounded h-40"
      />
      <button type="submit" className="bg-yellow-500 text-white rounded p-2">
        수정완료
      </button>
    </form>
  );
}

export default PostEdit;
