import { Notification } from "../models/notification.model.js";


export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("actor", "username profilePicture")
      .populate({
        path: "post",
        select: "image caption author",
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(" Notification fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching notifications",
      error: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(" Mark notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while marking notifications as read",
      error: error.message,
    });
  }
};
