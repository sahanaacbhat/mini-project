import { useState, useEffect, useRef, useCallback } from "react";
import { authAPI, messageAPI } from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Send, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Messages = () => {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchSuggestedUsers = useCallback(async () => {
    try {
      const data = await authAPI.getSuggestedUsers();
      if (data.success) setSuggestedUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      const data = await messageAPI.getMessages(selectedUser._id);
      if (data.success) setMessages(data.messages || []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchSuggestedUsers();
  }, [fetchSuggestedUsers]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;
    try {
      const result = await messageAPI.sendMessage(selectedUser._id, messageText);
      if (result.success) {
        setMessages([...messages, result.newMessage]);
        setMessageText("");
      }
    } catch {
      toast.error("Failed to send message");
    }
  };

  const renderProfilePic = (userObj, size = 36) => {
    let src = null;
    let username = "User";
    if (userObj && typeof userObj === "object") {
      src = userObj.profilePicture || null;
      username = userObj.username || "User";
    }
    return src ? (
      <img
        src={src}
        alt={username}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        onError={(e) =>
          (e.target.src = `https://via.placeholder.com/${size}?text=User`)
        }
      />
    ) : (
      <div
        className="rounded-full bg-gray-300 flex items-center justify-center border"
        style={{ width: size, height: size }}
      >
        <User className="text-gray-500" style={{ width: size / 2, height: size / 2 }} />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 py-0 max-w-full h-[calc(100vh-4rem)]">
      <div className="flex h-full border rounded-lg bg-white">
        <div className="w-1/3 p-3 overflow-y-auto hide-scrollbar border-r">
          <h2 className="text-xl font-semibold mb-3">Messages</h2>
          {suggestedUsers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {suggestedUsers.map((su) => (
                <button
                  key={su._id}
                  onClick={() => setSelectedUser(su)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                    selectedUser?._id === su._id ? "bg-gray-100" : ""
                  }`}
                >
                  {renderProfilePic(su, 36)}
                  <div className="text-left">
                    <p className="font-semibold text-sm">{su.username}</p>
                    <p className="text-xs text-gray-500">{su.email || "New on Instagram"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                {renderProfilePic(selectedUser, 36)}
                <div>
                  <p className="font-semibold">{selectedUser.username}</p>
                  <Link
                    to={`/profile/${selectedUser._id}`}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 text-sm">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const senderId =
                      typeof message.senderId === "object"
                        ? message.senderId._id?.toString() || message.senderId.toString()
                        : message.senderId?.toString();
                    const userIdStr = user?._id?.toString() || user?._id;
                    const isOwnMessage = senderId === userIdStr;

                    return (
                      <div
                        key={message._id}
                        className={`flex items-end gap-2 ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isOwnMessage && renderProfilePic(message.senderId, 32)}
                        <div
                          className={`max-w-md p-3 break-words rounded-3xl ${
                            isOwnMessage
                              ? "bg-blue-100 text-black rounded-br-none"
                              : "bg-pink-100 text-black rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full"
                />
                <Button type="submit" disabled={!messageText.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center text-sm">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select a user to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
