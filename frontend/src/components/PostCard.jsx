import { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Trash2,
  MoreVertical,
  UserPlus,
  UserMinus,
} from 'lucide-react';
import { postAPI, authAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ProfileImage = ({ src, alt, size = 40 }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className="rounded-full object-cover border"
        style={{ width: size, height: size }}
        onError={() => setImgSrc(null)}
      />
    );
  }

  
  return (
    <div
      className="rounded-full bg-gray-300 flex items-center justify-center border"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-500"
        width={size / 2.5}
        height={size / 2.5}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A8.962 8.962 0 0112 15c2.21 0 4.21.895 5.879 2.365M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );
};

const PostCard = ({ post, onUpdate, onOpenComments }) => {
  const { user, updateUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwnPost = post.author._id === user._id;
  const isFollowing = user?.following?.includes(post.author._id);

  useEffect(() => {
    setIsLiked(
      post.likes?.some((likeId) => {
        const likeStr =
          typeof likeId === 'object' ? likeId._id?.toString() : likeId.toString();
        return likeStr === user?._id?.toString();
      }) || false
    );

    setIsBookmarked(
      user?.bookmarks?.some((bookmarkId) => {
        const bookmarkStr =
          typeof bookmarkId === 'object'
            ? bookmarkId._id?.toString()
            : bookmarkId.toString();
        return bookmarkStr === post._id;
      }) || false
    );
  }, [post, user]);

 
  const handleLike = async () => {
    try {
      let updatedLikes = [...post.likes];
      if (isLiked) {
        await postAPI.dislikePost(post._id);
        updatedLikes = updatedLikes.filter(
          (like) => like.toString() !== user._id.toString()
        );
        setIsLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        await postAPI.likePost(post._id);
        updatedLikes.push(user._id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
      onUpdate?.({ ...post, likes: updatedLikes });
    } catch (err) {
      console.error(err);
      toast.error('Failed to like post');
    }
  };

 
  const handleBookmark = async () => {
    try {
      const result = await postAPI.bookmarkPost(post._id);
      setIsBookmarked((prev) => !prev);
      toast.success(result.message);

      const userData = await authAPI.getCurrentUser();
      if (userData.success && updateUser) updateUser(userData.user);
    } catch {
      toast.error('Failed to bookmark post');
    }
  };

  const handleDelete = async () => {
    try {
      await postAPI.deletePost(post._id);
      toast.success('Post deleted');
      onUpdate?.({ deleted: true, _id: post._id });
    } catch {
      toast.error('Failed to delete post');
    }
  };
  const handleFollowToggle = async () => {
    try {
      const result = await authAPI.followOrUnfollow(post.author._id);
      if (result.success) {
        const userData = await authAPI.getCurrentUser();
        if (userData.success && updateUser) updateUser(userData.user);
        toast.success(result.message);
      }
    } catch {
      toast.error('Failed to update follow status');
    }
  };

  return (
    <div className="bg-white border rounded-lg last:mb-0 mb-4 transition-all">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author._id}`}>
            <ProfileImage
              src={post.author?.profilePicture}
              alt={post.author?.username}
              size={40}
            />
          </Link>
          <Link to={`/profile/${post.author._id}`} className="font-semibold">
            {post.author?.username}
          </Link>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            <MoreVertical className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              {isOwnPost ? (
                <button
                  onClick={() => {
                    handleDelete();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFollowToggle();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  {isFollowing ? (
                    <UserMinus className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <img
        src={post.image}
        alt={post.caption}
        className="w-full object-cover"
        onError={(e) => (e.target.src = 'https://via.placeholder.com/400x400')}
      />
      <div className="p-4">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={handleLike}>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button onClick={() => onOpenComments(post)}>
            <MessageCircle className="w-6 h-6" />
          </button>
          <button onClick={handleBookmark}>
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        <p className="font-semibold mb-1">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </p>

        <div className="mb-2">
          <span className="font-semibold mr-2">{post.author?.username}</span>
          <span>{post.caption}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
