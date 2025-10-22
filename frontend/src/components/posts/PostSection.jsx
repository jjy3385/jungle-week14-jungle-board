import { useState } from 'react';
import PostList from './PostList';
import PostPreview from './PostPreview';

export default function PostSection() {
  const [selectedPost, setSelectedPost] = useState(null);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6">
      <PostList onSelect={setSelectedPost} selectedPostId={selectedPost?.id} />
      <PostPreview post={selectedPost} />
    </div>
  );
}
