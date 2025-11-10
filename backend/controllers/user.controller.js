import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";

const DEFAULT_PROFILE_PIC = "https://via.placeholder.com/150";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: DEFAULT_PROFILE_PIC,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password", success: false });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in .env");
      return res.status(500).json({ message: "Server configuration error", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await user.populate({ path: "posts", options: { sort: { createdAt: -1 } } });

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture:
        user.profilePicture && user.profilePicture.trim() !== ""
          ? user.profilePicture
          : DEFAULT_PROFILE_PIC,
      bio: user.bio || "",
      gender: user.gender || "",
      followers: user.followers || [],
      following: user.following || [],
      posts: user.posts || [],
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const logout = async (_, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } });

    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    const userData = {
      ...user.toObject(),
      profilePicture:
        user.profilePicture && user.profilePicture.trim() !== ""
          ? user.profilePicture
          : DEFAULT_PROFILE_PIC,
    };

    return res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({ path: "posts", options: { sort: { createdAt: -1 } } });

    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    const userData = {
      ...user.toObject(),
      profilePicture:
        user.profilePicture && user.profilePicture.trim() !== ""
          ? user.profilePicture
          : DEFAULT_PROFILE_PIC,
    };

    return res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    const userData = {
      ...user.toObject(),
      profilePicture:
        user.profilePicture && user.profilePicture.trim() !== ""
          ? user.profilePicture
          : DEFAULT_PROFILE_PIC,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    const usersData = users.map((user) => ({
      ...user.toObject(),
      profilePicture:
        user.profilePicture && user.profilePicture.trim() !== ""
          ? user.profilePicture
          : DEFAULT_PROFILE_PIC,
    }));

    return res.status(200).json({ success: true, users: usersData });
  } catch (error) {
    console.error("Suggested users error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followerId = req.id;
    const followeeId = req.params.id;

    if (followerId === followeeId) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
    }

    const user = await User.findById(followerId);
    const targetUser = await User.findById(followeeId);

    if (!user || !targetUser)
      return res.status(404).json({ message: "User not found", success: false });

    if (!user.following) user.following = [];
    if (!targetUser.followers) targetUser.followers = [];

    const isFollowing = user.following.includes(followeeId);

    if (isFollowing) {
      await Promise.all([
        User.updateOne({ _id: followerId }, { $pull: { following: followeeId } }),
        User.updateOne({ _id: followeeId }, { $pull: { followers: followerId } }),
      ]);
      return res.status(200).json({ message: "Unfollowed successfully", success: true });
    } else {
      await Promise.all([
        User.updateOne({ _id: followerId }, { $push: { following: followeeId } }),
        User.updateOne({ _id: followeeId }, { $push: { followers: followerId } }),
      ]);
      return res.status(200).json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.error("Follow/unfollow error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
