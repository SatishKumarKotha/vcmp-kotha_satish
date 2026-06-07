import { body } from "express-validator";

// ------------Validating the email and password before passing to controller ---------------\\
export const loginValidator = [

    //-------email---------\\
  body("email")
    .notEmpty()
    .withMessage("Email is mandatory")
    .isEmail()
    .withMessage("Please provide a valid email"),

     //-------password---------\\
  body("password")
    .notEmpty()
    .withMessage("Password is mandatory")
];


// ----change password validator ------------------
export const changePasswordValidator = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is mandatory"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is mandatory")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
];