import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const { values, handleChange, reset } = useForm({
    username: '',
    password: '',
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(values);
      reset();
      navigate('/');
    } catch (err) {
      alert(err.message ?? '로그인에 실패했습니다.');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-brand-navyLight mb-1">
          아이디
        </label>
        <input
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          className="w-full rounded-xl border border-brand-skyBorder bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sky text-brand-navy"
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm text-brand-navyLight mb-1">
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="w-full rounded-xl border border-brand-skyBorder bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-sky text-brand-navy"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-brand-sky hover:bg-brand-navyLight text-white py-3 rounded-xl text-sm font-medium shadow-[0_10px_20px_rgba(85,166,255,0.35)] transition"
      >
        로그인
      </button>
    </form>
  );
}
