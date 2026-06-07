import express from "express";  

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleWare from "../middlewares/role.middleware.js";
import {getVendors} from "../controllers/vendor.controller.js";
import {getVendorById} from "../controllers/vendor.controller.js";
import {updateVendor} from "../controllers/vendor.controller.js";
import {approveVendor} from "../controllers/vendor.controller.js";
import {updateVendorStatus} from "../controllers/vendor.controller.js";
import {deleteVendor} from "../controllers/vendor.controller.js";
import {createVendor} from "../controllers/vendor.controller.js";


const router = express.Router(); // express router 

router.get("/",authMiddleware, getVendors);

router.post("/", authMiddleware,createVendor);

router.get("/:id", authMiddleware,getVendorById);

router.patch("/:id", authMiddleware,updateVendor);

router.patch("/:id/approve", authMiddleware,  roleMiddleWare("ADMIN"),approveVendor);

router.patch("/:id/status",authMiddleware, updateVendorStatus);

router.delete("/:id",authMiddleware, deleteVendor);

export default router;