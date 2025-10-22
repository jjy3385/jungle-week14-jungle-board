import { useForm } from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
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
      alert('로그인 성공!');
      reset();
      navigate('/');
    } catch (error) {
      alert(error.message);
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
