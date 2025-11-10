import { useState, useEffect } from 'react';
import { postAPI } from '../lib/api';
import { toast } from 'sonner';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';
import CommentsModal from '../components/CommentsModal';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postAPI.getAllPosts();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const handlePostUpdate = (updatedPost) => {
    if (!updatedPost) return;

    setPosts((prevPosts) => {
      if (updatedPost.deleted) {
        return prevPosts.filter((p) => p._id !== updatedPost._id);
      }
      return prevPosts.map((p) =>
        p._id === updatedPost._id ? updatedPost : p
      );
    });
  };

  const handleOpenComments = (post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-0">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No posts yet. Follow users to see their posts!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onUpdate={handlePostUpdate} 
            onOpenComments={handleOpenComments}
          />
        ))
      )}
      {showComments && selectedPost && (
        <CommentsModal
          post={selectedPost}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default Home;
