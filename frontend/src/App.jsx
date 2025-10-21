import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PostDetail from './pages/PostDetail';
import PostWrite from './pages/PostWrite';
import PostEdit from './pages/PostEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/write" element={<PostWrite />} />
        <Route path="/edit/:id" element={<PostEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
