import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAllAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/mark-all-read", isAuthenticated, markAllAsRead);

export default router;
