import bcrypt from "bcrypt";
import jwtToken from "jsonwebtoken";
import connectionPool from "../config/db.js";

export const loginUser= async (email, password) => {
    try{
 //-------------check email and password found in DB-----------------------\\
  const [Vendors] = await connectionPool.execute(
    ` SELECT id,  name, email,   password_hash,   role,status
        FROM users
       WHERE email = ?
    `,
    [email]
  );
 // -------------- check if not record found throw invalid email or password -------------------\\
  if (Vendors.length === 0) {
    throw new Error("Invalid email or password");
  }
//-----------capturing into variable-----------------\\
  const vendor = Vendors[0];
//---------------------check password with bcrpyt compare-----------------\\
  const isPasswordValid = await bcrypt.compare(password,vendor.password_hash );

  if (!isPasswordValid) {
    throw new Error("Invalid  password");
  }
//-------------Jwt Token generation if user is Valid------------------\\
  const token = jwtToken.sign(
    {
      userId: vendor.id,
      role: vendor.role
    },   // 1---payload
    process.env.JWT_SECRET,  // 2----secret key
    {
      expiresIn: process.env.JWT_EXPIRES_IN  // 3------expiry time 15 minutes
    }
  );

  //----------referesh token for 7 days------------------\\
  const refreshToken = jwtToken.sign(
  {
    userId: vendor.id
  },
  process.env.JWT_REFRESH_SECRET,
  {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  }
);

  return {
    userInfo: {
        accessToken:token,
        refreshToken:refreshToken,
        user:{
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      role: vendor.role
    }
}
  };
    }catch(error){
        console.log(error);
        throw new Error(`${error.message}`);

    }

   
};
// to fetch the Vendor Details with UserID (Vendor ID)
export const getUserById = async (userID) => {
  try {

    const [users] = await connectionPool.execute(
      `SELECT id, name,email, role,status FROM users  WHERE id = ?`, [userID]
    );

    if (users.length === 0) {
      return null;
    }

    return users[0];

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const refreshTokenService = async (refreshToken) => {

    // if Refersh Token is empty then Throw Error -----------------\\
  if (!refreshToken) {
    throw new Error("Refresh token is mandatory");
  }

  // ---------------Verify Refersh Token using Jwt----------------\\
  const verifyRefreshToken = jwtToken.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const [Vendors] = await connectionPool.execute(
    `
      SELECT id, role,status FROM users WHERE id = ?
    `,
    [verifyRefreshToken.userId]
  );

  if (Vendors.length === 0) {
    throw new Error("Vendor is not found");
  }

  const Vendor = Vendors[0];

  const accessToken = jwtToken.sign(
    {
      userId: Vendor.id,
      role: Vendor.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  return {
    accessToken
  };
};

export const changePasswordService = async (
  userID,
  oldPassword,
  newPassword
) => {

    // -----------_Find the record with userID--------------\\
  const [users] = await connectionPool.execute(
    `
    SELECT
      id,
      password_hash
    FROM users
    WHERE id = ?
    `,
    [userID]
  );

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const user = users[0];

  //---------compare old password before updating new password ----------------------\\
  const isValid = await bcrypt.compare(
    oldPassword,
    user.password_hash
  );

  if (!isValid) {
    throw new Error("Old password is incorrect");
  }

  // -----------compare old password before updating the same new password as old -----------------\\
  if (oldPassword === newPassword) {
    throw new Error(
      "New password must be different from old password"
    );
  }
//-----------hash password before updating into db
  const newHashPassword = await bcrypt.hash(
    newPassword,
    10
  );

  // -------------------update the new password ----------------------\\
  await connectionPool.execute(
    `
    UPDATE users
    SET password_hash = ?
    WHERE id = ?
    `,
    [newHashPassword, userID]
  );

  return {
    message: "Password changed successfully"
  };
};

export const updateProfileService =
async (
  userId,
  name
) => {

  await connectionPool.execute(
    `
    UPDATE users
    SET name = ?
    WHERE id = ?
    `,
    [
      name,
      userId
    ]
  );

};