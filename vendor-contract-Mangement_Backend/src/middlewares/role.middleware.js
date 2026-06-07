const roleMiddleWare=(...allowedRoles)=>{
    return   (req,res,next)=>{
       if (!req.user){
        return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
       }
       //-------check is this user access to this api---------------\\
         const userRole = req.user.role;
         if(!allowedRoles.includes(userRole)){
              return res.status(403).json({
                success: false,
                message: "Access Denied"
      });
         }
        
     next();
     }
}
export default roleMiddleWare;