import {
  createInvoiceService,
  getInvoicesService,
  getInvoiceByIdService,
  approveInvoiceService,
  markInvoicePaidService,
  disputeInvoiceService
} 
  from "../services/invoice.service.js"

export const createInvoice =
async (
  req,
  res
) => {

  try {

    const result =
      await createInvoiceService(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: result.message,
      invoiceId: result.invoiceId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const getInvoices = async (
  req,
  res
) => {

  try {

    const {
      page = 1,
      limit = 10,
      status,
      fromDate,
      toDate
    } = req.query;

    const result =
      await getInvoicesService(
        page,
        limit,
        status,
        fromDate,
        toDate
      );

    return res.status(200).json({
      success: true,
      data: result.invoices,
      pagination: result.pagination
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getInvoiceById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const invoice =
      await getInvoiceByIdService(
        id
      );

    return res.status(200).json({
      success: true,
      data: invoice
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

export const approveInvoice =
async (
  req,
  res
) => {

  try {
    const { id } = req.params;
    const reviewerId =
      req.user.userId;

    const result =
      await approveInvoiceService(
        id,
        reviewerId
      );

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
     console.log(error)
    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};
export const markInvoicePaid =
async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { payment_ref } =
      req.body;

    const reviewerId =
      req.user.userId;

    const result =
      await markInvoicePaidService(
        id,
        payment_ref,
        reviewerId
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

export const disputeInvoice =
async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      dispute_reason
    } = req.body;

    const reviewerId =
      req.user.userId;

    const result =
      await disputeInvoiceService(
        id,
        dispute_reason,
        reviewerId
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