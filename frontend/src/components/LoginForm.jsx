import React from 'react';
import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { values, handleChange, reset } = useForm({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //username/password 일치하는지 확인
    const res = await fetch(
      `http://localhost:4000/users?username=${values.username}&password=${values.password}`
    );
    const data = await res.json();

    if (data.length > 0) {
      //로그인 성공 시 localStorage 사용
      localStorage.setItem('user', JSON.stringify(data[0]));
      alert(`로그인 성공! 환영합니다 ${data[0].username}님!`);
      reset();
      navigate('/');
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-60 mx-auto mt-20"
    >
      <h2 className="text-xl font-bold text-center mb-3">로그인</h2>
      <input
        type="text"
        name="username"
        placeholder="아이디"
        value={values.username}
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
      <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">
        로그인
      </button>
    </form>
  );
}
export default LoginForm;
