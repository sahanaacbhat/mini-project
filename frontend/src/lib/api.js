import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export const authAPI = {
  register: async (data) => (await api.post("/user/register", data)).data,
  login: async (data) => (await api.post("/user/login", data)).data,
  logout: async () => (await api.get("/user/logout")).data,
  getCurrentUser: async () => (await api.get("/user/current")).data,
  getProfile: async (userId) => (await api.get(`/user/${userId}/profile`)).data,
  editProfile: async (formData) =>
    (
      await api.post("/user/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,
  getSuggestedUsers: async () => (await api.get("/user/suggested")).data,
  followOrUnfollow: async (userId) =>
    (await api.post(`/user/followorunfollow/${userId}`)).data,
  getNotifications: async () => (await api.get("/notifications")).data,
  markAllNotificationsRead: async () =>
    (await api.put("/notifications/mark-all-read")).data,
};


export const postAPI = {
  getAllPosts: async () => (await api.get("/post/all")).data,
  getUserPosts: async (userId) => (await api.get(`/post/user/${userId}`)).data,
  createPost: async (formData) =>
    (
      await api.post("/post/addpost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data,
  likePost: async (postId) => (await api.put(`/post/${postId}/like`)).data,
  dislikePost: async (postId) => (await api.put(`/post/${postId}/dislike`)).data,

  
  addComment: async (postId, text) =>
    (await api.post(`/comments/${postId}`, { text })).data,
  getComments: async (postId) =>
    (await api.get(`/comments/${postId}/all`)).data,
  deleteComment: async (commentId) =>
    (await api.delete(`/comments/${commentId}/delete`)).data,

  deletePost: async (postId) => (await api.delete(`/post/delete/${postId}`)).data,
  bookmarkPost: async (postId) =>
    (await api.get(`/post/${postId}/bookmark`)).data,
};

export const notificationAPI = {
  list: async () => (await api.get("/notifications")).data,
  markAllRead: async () => (await api.put("/notifications/mark-all-read")).data,
};

export const messageAPI = {
  sendMessage: async (receiverId, textMessage) =>
    (await api.post(`/message/send/${receiverId}`, { textMessage })).data,
  getMessages: async (receiverId) =>
    (await api.get(`/message/all/${receiverId}`)).data,
};
