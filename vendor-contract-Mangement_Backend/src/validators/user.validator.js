import { body } from "express-validator";

export const createUserValidator = [
  body("name") .notEmpty().withMessage("Name is required"),
  body("email").notEmpty() .withMessage("Email is mandatory") .isEmail()   .withMessage("Invalid email"),
body("password").notEmpty().withMessage("Password is required").isLength({ min: 8 })
.withMessage("Password must be minimum 8 characters"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["ADMIN", "PROCUREMENT", "FINANCE"])
    .withMessage("Invalid role")
];