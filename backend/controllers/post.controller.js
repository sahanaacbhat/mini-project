import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    const author = req.id;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author,
    });

    await User.findByIdAndUpdate(author, { $push: { posts: post._id } });

    return res.status(201).json({ success: true, message: "Post created", post });
  } catch (error) {
    console.error("🔥 Error creating post:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture")
      .populate("comments.user", "username profilePicture");

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(" Error fetching posts:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("comments.user", "username profilePicture");

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error(" Error fetching user posts:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save({ validateBeforeSave: false });
      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.author,
          actor: userId,
          type: "like",
          post: post._id,
        });
      }
    }

    return res.status(200).json({ success: true, message: "Post liked" });
  } catch (error) {
    console.error(" Error liking post:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save({ validateBeforeSave: false }); 

    return res.status(200).json({ success: true, message: "Post disliked" });
  } catch (error) {
    console.error(" Error disliking post:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.id;
    const { postId } = req.params;

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment text required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({ user: userId, text: text.trim(), createdAt: new Date() });
    await post.save();

    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        actor: userId,
        type: "comment",
        post: post._id,
      });
    }

    const updatedPost = await Post.findById(postId)
      .populate("comments.user", "username profilePicture")
      .select("comments");

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(" Error adding comment:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(" Error deleting post:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const userId = req.id;
    const { postId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.bookmarks.includes(postId)) {
      user.bookmarks.push(postId);
      await user.save();
      return res.status(200).json({ success: true, message: "Post bookmarked" });
    } else {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);
      await user.save();
      return res.status(200).json({ success: true, message: "Post removed from bookmarks" });
    }
  } catch (error) {
    console.error(" Error bookmarking post:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("comments.user", "username profilePicture")
      .select("comments");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      comments: post.comments || [],
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
