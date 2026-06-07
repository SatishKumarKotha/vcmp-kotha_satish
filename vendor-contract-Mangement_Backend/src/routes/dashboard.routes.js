import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
  getDashboardSummary,
  getDashboardSpending,
  getDashboardAlerts,
  getAuditLogs
} from "../controllers/dashboard.controller.js";

const router = express.Router();


router.get( "/summary",authMiddleware, getDashboardSummary);
router.get("/spending",authMiddleware,roleMiddleware("ADMIN", "FINANCE"), getDashboardSpending);
router.get("/alerts",authMiddleware,getDashboardAlerts);
router.get("/audit-logs",authMiddleware, roleMiddleware("ADMIN"), getAuditLogs);

export default router;