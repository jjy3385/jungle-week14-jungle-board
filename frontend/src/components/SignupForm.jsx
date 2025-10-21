import React from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const { values, handleChange, reset } = useForm({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:4000/signup`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      reset();
      navigate('/login');
    } else {
      alert('회원가입 실패');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-60 mx-auto mt-20"
    >
      <h2 className="text-xl font-bold text-center mb-3">회원가입</h2>
      <input
        type="text"
        name="username"
        placeholder="아이디"
        value={values.username}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="이메일"
        value={values.email}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={values.password}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-green-500 text-white rounded p-2 mt-2"
      >
        회원가입
      </button>
    </form>
  );
}

export default SignupForm;
