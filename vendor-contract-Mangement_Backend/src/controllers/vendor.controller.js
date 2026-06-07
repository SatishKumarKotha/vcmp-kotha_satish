
import {
  getVendorByIdService,
  createVendorService,
  approveVendorService,
  updateVendorStatusService,
  updateVendorService,
  deleteVendorService,
  getVendorsService
} from "../services/vendor.service.js";
export const getVendorById = async (req, res) => {
  try {

    const { id } = req.params;

    const vendor =
      await getVendorByIdService(id);

      console.log(`vendor`,vendor)

    return res.status(200).json({
      success: true,
      data: vendor
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }
};

export const updateVendor = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const result =
      await updateVendorService(
        id,
        req.body
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

export const updateVendorStatus =async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const result =
      await updateVendorStatusService(
        id,
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

export const getVendors = async (req,res) => {
  try {

    const {page = 1,limit = 10,search,status,category } = req.query;

    const result =await getVendorsService( page,limit, search,status,category);
    console.log(`getVednorslist`,result)

    return res.status(200).json({
      success: true,
      data: result.vendors,
      pagination: result.pagination
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
export const approveVendor = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const adminId =
      req.user.userId;

    const result =
      await approveVendorService(
        id,
        adminId
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

    console.log(error);

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};
export const deleteVendor = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const result =
      await deleteVendorService(id);

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

