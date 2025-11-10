import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";

dotenv.config();

const restorePosts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Find or create test user
    let testUser = await User.findOne({ email: "testuser@example.com" });
    if (!testUser) {
      testUser = await User.create({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword", // For testing only; hash in production
      });
      console.log("✅ Test user created");
    }

    // Posts data matching Post schema
    const postsData = [
      {
        caption: "Hello world! This is test post 1",
        image: "https://via.placeholder.com/150",
        author: testUser._id,
      },
      {
        caption: "Hello world! This is test post 2",
        image: "https://via.placeholder.com/150",
        author: testUser._id,
      },
    ];

    // Create posts if they don't exist
    for (const post of postsData) {
      const exists = await Post.findOne({ caption: post.caption });
      if (!exists) {
        await Post.create(post);
        console.log("✅ Post created:", post.caption);
      } else {
        console.log("⚠️ Post already exists:", post.caption);
      }
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error restoring posts:", err);
    await mongoose.disconnect();
  }
};

// Run the restore function
restorePosts();
