import express from "express";

import authMiddleware
from "../middlewares/auth.middleware.js";

import {
  getNotifications,
  markNotificationRead
}
from "../controllers/notification.controller.js";

const router =
  express.Router();

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationRead
);

export default router;