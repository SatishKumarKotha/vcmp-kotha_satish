import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleWare from "../middlewares/role.middleware.js";
import connectionPool from "../config/db.js";
import {
  getContracts,
  createContract,
  getContractById,
  updateContract,
  approveContract,
  terminateContract
} from "../controllers/contract.controller.js";

const router = express.Router();

router.get( "/",authMiddleware,getContracts);
router.post( "/", authMiddleware, roleMiddleWare(  "ADMIN","PROCUREMENT"  ), createContract);
router.get("/:id",authMiddleware, getContractById);
router.patch( "/:id",authMiddleware,roleMiddleWare("ADMIN","PROCUREMENT"),updateContract);
router.patch("/:id/approve",authMiddleware,roleMiddleWare("ADMIN","FINANCE" ),approveContract);
router.patch("/:id/terminate",authMiddleware, roleMiddleWare("ADMIN"),terminateContract);

export default router;