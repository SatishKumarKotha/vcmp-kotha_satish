import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleWare from "../middlewares/role.middleware.js";

import {
  getAuditLogs
} from "../controllers/audit.controller.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleWare("ADMIN"),
  getAuditLogs
);

export default router;