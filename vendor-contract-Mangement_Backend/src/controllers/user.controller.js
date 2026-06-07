import connectionPool from "../config/db.js";
import { getUsersService,getUserByIdService,updateUserService,deleteUserService,createUserService } from "../services/user.service.js";

export const getUsers=async (req,res)=>{
 try{
     //----------Check Search Inputs is Provided-----------------\\
       const {page=1,limit=100,search,role,status}= req.query;

    const usersData = await getUsersService( page,limit,search,role,status);

return res.status(200).json({
  success: true,
  result: usersData.users,
  pagination: usersData.pagination
});

 }catch(error){
    console.log(error);
    return res.status(500).json({
        status:false,
        message:error.message
    })
 }

 
}
export const createUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role
    } = req.body;

    const result = await createUserService(
      name,
      email,
      password,
      role
    );

    return res.status(201).json({
      success: true,
      message: result.message,
      userId: result.userId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

export const getUserById = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const result =
      await getUserByIdService(id);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }
};

export const updateUser = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const {
      name,
      role,
      status
    } = req.body;

    const result =
      await updateUserService(
        id,
        name,
        role,
        status
      );

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

export const deleteUser = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const result =
      await deleteUserService(id);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

export const createVendor = async (
  req,
  res
) => {

  try {

    const result =
    await createVendorService(
      req.body,
      req.user.userId
    );

    return res.status(201).json({
      success: true,
      message: result.message,
      vendorId: result.vendorId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};