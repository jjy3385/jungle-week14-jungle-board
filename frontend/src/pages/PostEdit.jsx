import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/client';

function PostEdit() {
  const { id } = useParams();
  const { values, handleChange, reset } = useForm({ title: '', content: '' });
  const navigate = useNavigate();
  const { user, initializing } = useAuth();

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`/posts/${id}`);
      if (!res.ok) {
        alert('게시글을 불러오지 못했습니다.');
        navigate('/');
        return;
      }
      reset(await res.json());
    })();
  }, [id, reset, navigate]);

  useEffect(() => {
    if (!initializing && !user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [initializing, user, navigate]);

  if (initializing || !user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: values.title,
      content: values.content,
    };
    const res = await apiFetch(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('수정이 완료되었습니다.');
      navigate(`/posts/${id}`);
    } else if (res.status === 403) {
      alert('본인 글만 수정할 수 있습니다.');
    } else {
      alert('수정에 실패했습니다.');
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
