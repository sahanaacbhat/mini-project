import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { postAPI } from "../lib/api";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Send, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);


const Avatar = ({ src, alt, size = 32 }) => {
  const defaultAvatar = "/images/default-avatar.png";
  const [imgSrc, setImgSrc] = useState(src || defaultAvatar);

  const handleError = () => {
    if (imgSrc !== defaultAvatar) setImgSrc(defaultAvatar);
  };

  return (
    <img
      src={imgSrc}
      alt={alt || "avatar"}
      onError={handleError}
      loading="lazy"
      className="rounded-full object-cover border border-gray-300 bg-gray-100"
      style={{ width: size, height: size }}
    />
  );
};

const Comments = () => {
  const { id } = useParams(); 
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const commentsEndRef = useRef(null);


  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postAPI.getComments(id);
      if (res.success && Array.isArray(res.comments)) {
        setComments(res.comments);
      } else if (Array.isArray(res)) {
        setComments(res);
      }
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [id]);
  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await postAPI.addComment(id, commentText.trim());
      if (res.success) {
        setCommentText("");
        await loadComments();
        scrollToBottom();
        toast.success("Comment added");
      } else {
        toast.error(res.message || "Failed to add comment");
      }
    } catch {
      toast.error("Failed to add comment");
    }
  };


  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await postAPI.deleteComment(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success("Comment deleted");
      } else {
        toast.error(res.message || "Failed to delete comment");
      }
    } catch {
      toast.error("Error deleting comment");
    }
  };

  
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border-l border-r bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <Link to="/" className="text-blue-600 text-sm hover:underline">
          Back
        </Link>
        <h2 className="text-lg font-semibold">Comments</h2>
        <div />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center mt-4">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No comments yet.</p>
        ) : (
          comments.map((c) => {
            const user = c.user || c.author;
            const isCurrentUser = user?._id === currentUser?._id;

            return (
              <div
                key={c._id}
                className={`flex items-start gap-3 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <Avatar src={user?.profilePicture} alt={user?.username} />
                )}

                <div
                  className={`relative px-4 py-2 max-w-xs break-words rounded-2xl shadow-sm ${
                    isCurrentUser ? "bg-blue-100 ml-auto" : "bg-pink-100"
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="text-sm font-semibold mb-1">
                      {user?.username || "Unknown"}
                    </p>
                  )}
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {dayjs(c.createdAt).fromNow()}
                  </p>

                  {isCurrentUser && (
                    <button
                      onClick={() => deleteComment(c._id)}
                      className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
                      title="Delete comment"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {isCurrentUser && (
                  <Avatar
                    src={currentUser?.profilePicture}
                    alt={currentUser?.username}
                  />
                )}
              </div>
            );
          })
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Sticky Input */}
      <form
        onSubmit={submitComment}
        className="flex items-center p-3 border-t bg-white sticky bottom-0"
      >
        <Input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button type="submit" size="sm" disabled={!commentText.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default Comments;
