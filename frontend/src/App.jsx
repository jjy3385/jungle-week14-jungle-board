import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/write" element={<PostWrite />} />
          <Route path="/edit/:id" element={<PostEdit />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
