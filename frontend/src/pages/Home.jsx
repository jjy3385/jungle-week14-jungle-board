import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import MiniHomeLayout from '../layouts/MiniHomeLayout';
import Sidebar from '../components/Sidebar';
import GuestbookSection from '../components/guestbook/GuestbookSection';
import PostSection from '../components/posts/PostSection';
import { GuestbookProvider } from '../context/GuestbookContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('guestbook');
  const { user, initializing, logout } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-navyLight">
        로딩 중...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const sidebar = (
    <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
  );

  return (
    <GuestbookProvider>
      <MiniHomeLayout sidebar={sidebar} onLogout={logout}>
        {activeTab === 'guestbook' ? <GuestbookSection /> : <PostSection />}
      </MiniHomeLayout>
    </GuestbookProvider>
  );
}
