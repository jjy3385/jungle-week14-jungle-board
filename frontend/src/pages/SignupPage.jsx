import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout
      footer={
        <>
          이미 계정이 있으신가요?{' '}
          <Link
            to="/login"
            className="text-brand-sky hover:text-brand-navyLight font-medium"
          >
            로그인
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
