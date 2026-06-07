
import jwt from "jsonwebtoken";
// const AuthMiddleWare = (req,res,error,next)=>{
//        //--------------------- check the Autherization header is found ---------------------\\
//        const Token =req.headers['AUthorization'];

//        // ---if not found throw error unauthorized--------------\\
//        if(!Token){
//           res.status(401).json({
//             status:401,
//             message:`Access token is required`
//           })
//        }

//        //-----------------------verify token----------------------------\\
//        const verifyJwtToken = jwt.verify(Token,process.env.JWT_SECRET);
//        //---------------if verification fails then Invalid Toekn return  --------------
//        if(!verifyJwtToken){
//              res.status(401).json({
//             status:401,
//             message:`Invalid Token Found`
//           })
//        }
// next();
// }




const authMiddleware = (req, res, next) => {
  try {
    // ---------------get Authorization header from req---------------------------\\
    const authHeader = req.headers.authorization;

    //------------------ Check if header exists token--------------------\\
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing"
      });
    }

    //------------check Bearer format ------------------------------------\\
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }

    //----extract Token----------------\\
    const token = authHeader.split(" ")[1];

    //-----------verify token-----------------\\
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    //-----------attach user info to request ----------------\\
    req.user = verifyToken;

    next();

  } catch (error) {

     console.log(
    "AUTH ERROR:",
    error.name
  );

  console.log(
    "AUTH MESSAGE:",
    error.message
  );
    return res.status(401).json({
      success: false,
      message:  error.message
    });
  }
};

export default authMiddleware;