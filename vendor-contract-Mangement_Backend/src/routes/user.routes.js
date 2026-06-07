import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleWare from "../middlewares/role.middleware.js";
import { getUsers } from "../controllers/user.controller.js";
import { createUser } from "../controllers/user.controller.js";
import { getUserById } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = express.Router(); // express router 

router.get('/', authMiddleware, roleMiddleWare('ADMIN'), getUsers);
router.post("/", authMiddleware, roleMiddleWare("ADMIN"), createUser);
router.get("/:id",authMiddleware,roleMiddleWare("ADMIN"), getUserById);
router.patch( "/:id", authMiddleware,roleMiddleWare("ADMIN"),updateUser);
router.delete("/:id",authMiddleware,roleMiddleWare("ADMIN"),deleteUser);

export default router;