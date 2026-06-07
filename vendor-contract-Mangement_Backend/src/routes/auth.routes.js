import express from "express";  

import { login,getCurrentUser,refreshToken,changePassword ,updateProfile} from "../controllers/auth.controller.js";
import { loginValidator,changePasswordValidator } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
const router = express.Router(); // express router 

//-----------Auth Routes ------------- \\
router.post( "/login",loginValidator,login);
router.get( "/me",authMiddleware,getCurrentUser);
router.post( "/refresh",refreshToken);
router.patch( "/change-password",authMiddleware,changePasswordValidator,changePassword);
router.patch("/profile", authMiddleware,updateProfile);
//--------------

export default router;