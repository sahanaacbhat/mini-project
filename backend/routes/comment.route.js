import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { Comment } from "../models/comment.model.js";
import Post from "../models/post.model.js";

const router = express.Router();

// ✅ Get all comments for a post
router.get("/:postId/all", isAuthenticated, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    console.error("Get comments error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments" });
  }
});

// ✅ Add a comment
router.post("/:postId", isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment text required" });
    }

    const newComment = await Comment.create({
      user: req.id,
      post: req.params.postId,
      text: text.trim(),
    });

    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: newComment._id },
    });

    const populatedComment = await newComment.populate(
      "user",
      "username profilePicture"
    );

    res.json({ success: true, comment: populatedComment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
});

// ✅ Delete comment
router.delete("/:commentId/delete", isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.user.toString() !== req.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete" });
    }

    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ success: false, message: "Failed to delete comment" });
  }
});

export default router;
