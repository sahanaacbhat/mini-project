import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import multer from "multer";


import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js";
import commentRoute from "./routes/comment.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

const storage = multer.memoryStorage();
export const upload = multer({ storage });


app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/notifications", notificationRoute);


app.use("/api/v1/comments", commentRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running ",
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
