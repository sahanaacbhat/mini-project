import React, { useEffect, useState, useCallback } from "react";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const ProfileImage = React.memo(({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  if (imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className="w-9 h-9 rounded-full object-cover border"
        onError={() => setImgSrc(null)}
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center border">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-500"
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
});

const Suggestions = () => {
  const { user: currentUser } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);

  const loadSuggestions = useCallback(async () => {
    if (!currentUser?._id) return;
    setLoading(true);
    try {
      const data = await authAPI.getSuggestedUsers();
      if (data.success) {
        const filtered = data.users.filter(
          (u) => String(u._id) !== String(currentUser._id)
        );

        const updated = filtered.map((u) => ({
          ...u,
          isFollowing: currentUser.following?.includes(u._id),
        }));

        setSuggestedUsers(updated);
      }
    } catch {
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id, currentUser?.following]);

  useEffect(() => {
    loadSuggestions();
  }, [loadSuggestions]);

  const handleFollowToggle = async (userId, currentlyFollowing) => {
    try {
      setLoadingIds((prev) => [...prev, userId]);
      const res = await authAPI.followOrUnfollow(userId);

      if (res?.success) {
        toast.success(res.message);
        setSuggestedUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isFollowing: !currentlyFollowing }
              : user
          )
        );
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Follow/Unfollow Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      {currentUser && (
        <div className="flex items-center justify-between p-2 mb-3 bg-gray-50 rounded-lg">
          <Link to={`/profile/${currentUser._id}`} className="flex items-center gap-3">
            <ProfileImage src={currentUser.profilePicture} alt={currentUser.username} />
            <div>
              <p className="font-semibold text-sm">{currentUser.username}</p>
              <p className="text-xs text-gray-500">
                {currentUser.bio || "New on Instagram"}
              </p>
            </div>
          </Link>
        </div>
      )}

      <h2 className="font-semibold text-sm text-gray-700 mb-3">
        Suggested for you
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : suggestedUsers.length === 0 ? (
        <p className="text-gray-500 text-sm">No suggestions available</p>
      ) : (
        <div className="space-y-2">
          {suggestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                <ProfileImage src={user.profilePicture} alt={user.username} />
                <div>
                  <p className="font-semibold text-sm">{user.username}</p>
                  <p className="text-[11px] text-gray-500">
                    {user.bio || "New on Instagram"}
                  </p>
                </div>
              </Link>

              <Button
                onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                disabled={loadingIds.includes(user._id)}
                className={`text-[11px] w-20 h-7 rounded-full font-medium transition-all duration-200 ${
                  user.isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {loadingIds.includes(user._id)
                  ? "..."
                  : user.isFollowing
                  ? "Following"
                  : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
