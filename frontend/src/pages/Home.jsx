import { useState } from 'react';
import MiniHomeLayout from '../layouts/MiniHomeLayout';
import Sidebar from '../components/Sidebar';
import GuestbookSection from '../components/guestbook/GuestbookSection';
import PostSection from '../components/posts/PostSection';
import { GuestbookProvider } from '../context/GuestbookContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState('guestbook');
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#ff4d94]">
        로딩 중...
      </div>
    );
  }

  const sidebar = (
    <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
  );

  return (
    <GuestbookProvider>
      <MiniHomeLayout sidebar={sidebar}>
        {activeTab === 'guestbook' ? <GuestbookSection /> : <PostSection />}
      </MiniHomeLayout>
    </GuestbookProvider>
  );
}
