import { validationResult } from "express-validator";
import { loginUser,getUserById ,refreshTokenService,changePasswordService,updateProfileService} from "../services/auth.service.js";

// -----Login Controller ------------\\
export const login= async (req, res) => {
  try {
    // ---------use express validationResult to check Req------------\\
    const errors = validationResult(req); 

    //--------if any errors found  return bad request ----------------------\\
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
//------------- extracting the email and password using destructuring------------\\
    const { email, password } = req.body;

    //-------------calling service file method to check the credentials found and if found return token--------------\\
    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: `Login successful for User:${result.userInfo.user.name}`,
      response: result
    });
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const getCurrentUser=async (req,res)=>{
 try{
        const UserID = req.user.userId;

        // ----------UserID exist----------------\\
        if(!UserID){
             return res.status(401).json({
              success: false,
              message: `Invalid or Expiry Token `
          });
        }

        //----------------send userID to service method to fetch userDetails---------------------\\
     const Vendor = await getUserById(UserID);

     if (!Vendor) {
          return res.status(404).json({
            success: false,
            message: "Vendor not found"
          });
      }
      return res.status(200).json({
        success: true,
        VendorProfile: Vendor
      });
 }catch(error){
  console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message
    })
 }
}

export const refreshToken = async (req, res) => {
  try {

     // -------------capture the Refersh token from Req-------------------\\
    const { refreshToken } = req.body;

    //------------------- call refresh token service method to generate Access Token---------------------\\
    const refreshTokenResult = await refreshTokenService(refreshToken);

     return res.status(200).json({
      success: true,
      result: refreshTokenResult
    });

  } catch (error) {
      console.log(error)
    return res.status(401).json({
      success: false,
      message: error.message
    });

  }
};

export const changePassword = async (req, res) => {
  try {


    const userId = req.user.userId;

    const { oldPassword, newPassword } = req.body;

    //------------call change password service method to update new password-----------------\\
    const changePasswordResult = await changePasswordService(
      userId,
      oldPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: changePasswordResult.message
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

export const updateProfile =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const {
      name
    } = req.body;

    await updateProfileService(
      userId,
      name
    );

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully"
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        error.message
    });

  }

};