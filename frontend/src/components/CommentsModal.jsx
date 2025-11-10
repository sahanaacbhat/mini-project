import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { postAPI } from "../lib/api";
import { toast } from "sonner";

const Avatar = ({ src, alt }) => {
  const defaultAvatar = "/images/default-avatar.png"; 
  const [imageSrc, setImageSrc] = useState(src || defaultAvatar);

  const onErrorHandler = () => {
    if (imageSrc !== defaultAvatar) setImageSrc(defaultAvatar);
  };

  return (
    <img
      src={imageSrc}
      alt={alt || "avatar"}
      className="w-8 h-8 rounded-full object-cover"
      onError={onErrorHandler}
      loading="lazy"
    />
  );
};

const CommentsModal = ({ post, onClose }) => {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const commentsEndRef = useRef(null);

 
  useEffect(() => {
    if (!post?._id) return;

    const loadComments = async () => {
      try {
        setLoading(true);
        const res = await postAPI.getComments(post._id);
        if (res.success) {
          setComments(res.comments || []);
          setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
      } catch (error) {
        console.error("Load comments error:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    loadComments();

    const interval = setInterval(loadComments, 10000); 
    return () => clearInterval(interval);
  }, [post?._id]);

 
  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newCommentText = commentText.trim();
    setCommentText(""); 
    try {
      const res = await postAPI.addComment(post._id, newCommentText);
      if (res.success) {
        setComments((prev) => [res.comment, ...prev]);
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        toast.success("Comment added!");
      } else {
        toast.error(res.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Add comment error:", error);
      toast.error("Failed to add comment");
    }
  };

  
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await postAPI.deleteComment(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success("Comment deleted!");
      } else {
        toast.error(res.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error("Error deleting comment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end md:items-center bg-black bg-opacity-50">
      <div className="bg-white w-full md:max-w-3xl h-[80vh] rounded-t-lg md:rounded-lg flex flex-col md:flex-row overflow-hidden">
      
        <div className="hidden md:block md:w-1/2 bg-gray-200">
          <img src={post.image} alt="post" className="w-full h-full object-cover" />
        </div>

        
        <div className="flex flex-col w-full md:w-1/2">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Comments</h2>
            <button onClick={onClose} aria-label="Close comments">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-center">No comments yet.</p>
            ) : (
              comments.map((c) => {
                const isCurrentUser = c.user?._id === currentUser?._id;
                const author = c.user || { username: "Unknown", profilePicture: "/images/default-avatar.png" };

                return (
                  <div
                    key={c._id}
                    className={`flex items-start gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isCurrentUser && <Avatar src={author.profilePicture} alt={author.username} />}

                    <div
                      className={`px-4 py-2 max-w-xs break-words rounded-2xl shadow-sm ${
                        isCurrentUser ? "bg-blue-100 ml-auto" : "bg-pink-100"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">{author.username || "Unknown"}</p>
                      <p className="text-sm">{c.text}</p>

                      {isCurrentUser && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="text-xs text-red-500 hover:underline mt-1"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    {isCurrentUser && <Avatar src={currentUser?.profilePicture} alt={currentUser?.username} />}
                  </div>
                );
              })
            )}
            <div ref={commentsEndRef} />
          </div>

          <form onSubmit={submitComment} className="flex items-center p-3 border-t bg-white sticky bottom-0">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button type="submit" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
