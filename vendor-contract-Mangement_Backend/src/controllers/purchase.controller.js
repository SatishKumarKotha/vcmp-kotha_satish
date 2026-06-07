import { 
  createPurchaseOrderService,
  getPurchaseOrdersService,
  getPurchaseOrderByIdService,
  updatePurchaseOrderService,
  updatePurchaseOrderStatusService
 } from "../services/purchase.service.js";


export const createPurchaseOrder =
async (
  req,
  res
) => {

  try {

    const result =
      await createPurchaseOrderService(
        req.body,
        req.user.userId
      );

    return res.status(201).json({
      success: true,
      message: result.message,
      poId: result.poId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const getPurchaseOrders =
async (
  req,
  res
) => {

  try {

    const {
      page = 1,
      limit = 10,
      vendor_id,
      status
    } = req.query;

    const result =
      await getPurchaseOrdersService(
        page,
        limit,
        vendor_id,
        status
      );

    return res.status(200).json({
      success: true,
      data: result.purchaseOrders,
      pagination: result.pagination
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getPurchaseOrderById =
async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const result =
      await getPurchaseOrderByIdService(
        id
      );

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

export const updatePurchaseOrder =
async (
  req,
  res
) => {

  try {

    const result =
      await updatePurchaseOrderService(
        req.params.id,
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

export const updatePurchaseOrderStatus =
async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const result =
      await updatePurchaseOrderStatusService(
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

export const deletePurchaseOrder =
async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const result =
      await cancelPurchaseOrderService(
        id
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