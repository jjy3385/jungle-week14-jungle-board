import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';

export default function SignupForm() {
  const { values, handleChange, reset } = useForm({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiFetch('/signup', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (res.ok) {
      alert('회원가입 완료! 로그인 페이지로 이동합니다.');
      reset();
      navigate('/login');
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.detail ?? '회원가입에 실패했습니다');
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
