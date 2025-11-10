import express from "express";
import multer from "multer";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  deletePost,
  bookmarkPost,
  getComments,
} from "../controllers/post.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post("/addpost", isAuthenticated, upload.single("image"), createPost);
router.get("/all", isAuthenticated, getAllPosts);
router.get("/user/:id", isAuthenticated, getUserPosts);
router.put("/:postId/like", isAuthenticated, likePost);
router.put("/:postId/dislike", isAuthenticated, dislikePost);
router.post("/:postId/comment", isAuthenticated, addComment);
router.get("/:postId/comment/all", isAuthenticated, getComments);
router.delete("/delete/:postId", isAuthenticated, deletePost);
router.get("/:postId/bookmark", isAuthenticated, bookmarkPost);

export default router;
