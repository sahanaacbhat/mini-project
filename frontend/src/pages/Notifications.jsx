import React, { useEffect, useState } from "react";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProfileImage = React.memo(({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

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

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await authAPI.getNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      } else {
        toast.error(res.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Something went wrong while fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      const res = await authAPI.markAllNotificationsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to mark notifications as read");
    }
  };

  if (!user) {
    return <p className="text-center text-gray-500 mt-4">Please log in to view notifications.</p>;
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Notifications</h2>
        {notifications.length > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="ghost"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm text-center">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif._id}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                notif.isRead ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <Link to={`/profile/${notif.actor?._id}`}>
                <ProfileImage src={notif.actor?.profilePicture} alt={notif.actor?.username} />
              </Link>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{notif.actor?.username || "Someone"}</span>{" "}
                  {notif.type === "like"
                    ? "liked your post ❤️"
                    : notif.type === "comment"
                    ? "commented on your post 💬"
                    : notif.type === "follow"
                    ? "started following you 👥"
                    : "did something"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>

              {notif.post && (
                <Link to={`/post/${notif.post._id}`}>
                  <img
                    src={notif.post.image}
                    alt="post"
                    className="w-10 h-10 object-cover rounded-md border"
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
