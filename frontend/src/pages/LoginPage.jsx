import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      footer={
        <>
          아직 회원이 아니신가요?{' '}
          <Link
            to="/signup"
            className="text-brand-sky hover:text-brand-navyLight font-medium"
          >
            회원가입
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
