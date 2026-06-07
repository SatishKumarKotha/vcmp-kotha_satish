import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";

import {
  getPurchaseOrders,
  createPurchaseOrder,
  getPurchaseOrderById,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder
} from "../controllers/purchase.controller.js";

const router = express.Router();

router.get("/", authMiddleware,getPurchaseOrders);
router.post("/", authMiddleware,roleMiddleware("ADMIN", "PROCUREMENT"), createPurchaseOrder);
router.get("/:id",authMiddleware,getPurchaseOrderById);
router.patch("/:id",authMiddleware,roleMiddleware("ADMIN", "PROCUREMENT"),updatePurchaseOrder);
router.patch( "/:id/status", authMiddleware,roleMiddleware("ADMIN", "PROCUREMENT"),updatePurchaseOrderStatus);
router.delete( "/:id",authMiddleware,roleMiddleware("ADMIN"),deletePurchaseOrder);

export default router;