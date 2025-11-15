import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { authAPI } from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Settings, Loader2 } from "lucide-react";

const ProfileImage = ({ src, alt, size = 128 }) => {
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

const DEFAULT_POST_IMAGE = "https://via.placeholder.com/300x300";

const Profile = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user: currentUser, refreshUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authAPI.getProfile(id);
      if (data.success) {
        const fetchedUser = data.user;
        setUser(fetchedUser);
        setPosts(fetchedUser.posts || []);
        setIsOwnProfile(fetchedUser._id === currentUser?._id);

        const followingStatus = fetchedUser.followers?.some(
          followerId =>
            (typeof followerId === "object"
              ? followerId._id || followerId.toString()
              : followerId.toString()) === currentUser?._id
        );
        setIsFollowing(followingStatus || false);
      } else {
        toast.error("Failed to load profile");
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [id, currentUser?._id]);

  useEffect(() => {
    setUser(null);
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async () => {
    try {
      setIsFollowing(prev => !prev);
      const result = await authAPI.followOrUnfollow(id);

      if (result.success) {
        toast.success(result.message);
        await refreshUser?.();
        fetchProfile();
      } else {
        toast.error(result.message || "Failed to update follow status");
        setIsFollowing(prev => !prev);
      }
    } catch {
      toast.error("Failed to follow/unfollow");
      setIsFollowing(prev => !prev);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div key={location.pathname} className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-8">
          <ProfileImage src={user.profilePicture} alt={user.username} size={128} />

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-semibold">{user.username || "Unknown"}</h2>

              {isOwnProfile ? (
                <Link to="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <Button onClick={handleFollow} size="sm">
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>

            <div className="flex gap-8 mb-4">
              <div>
                <span className="font-semibold">{posts.length}</span> posts
              </div>
              <div>
                <span className="font-semibold">{user.followers?.length || 0}</span> followers
              </div>
              <div>
                <span className="font-semibold">{user.following?.length || 0}</span> following
              </div>
            </div>

            {user.bio && (
              <div>
                <p className="font-semibold">{user.username || "Unknown"}</p>
                <p>{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {posts.map(post => (
              <Link key={post._id} to={`/post/${post._id}`}>
                <img
                  src={post.image || DEFAULT_POST_IMAGE}
                  alt={post.caption || "Post"}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_POST_IMAGE;
                  }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
