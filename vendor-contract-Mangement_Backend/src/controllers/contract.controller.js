import {
  getContractsService,
  createContractService,
  getContractByIdService,
  updateContractService,
  approveContractService,
  terminateContractService
} from "../services/contract.service.js";

export const getContracts = async (
  req,
  res
) => {

  try {

    const {
      page = 1,
      limit = 10,
      vendor_id,
      status,
      start_date,
      end_date
    } = req.query;

    const result =
      await getContractsService(
        page,
        limit,
        vendor_id,
        status,
        start_date,
        end_date
      );

    return res.status(200).json({
      success: true,
      data: result.contracts,
      pagination: result.pagination
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const createContract = async (
  req,
  res
) => {

  try {
 console.log(`hiii_createContract`)
    const result =
      await createContractService(
        req.body,
        req.user.userId
      );

    return res.status(201).json({
      success: true,
      message: result.message,
      contractId: result.contractId
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const getContractById = async (
  req,
  res
) => {

  try {

    const result =
      await getContractByIdService(
        req.params.id
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

export const updateContract = async (
  req,
  res
) => {

  try {

    const result =
      await updateContractService(
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

export const approveContract = async (
  req,
  res
) => {

  try {

    const result =
      await approveContractService(
        req.params.id,
        req.user.userId
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

export const terminateContract = async (
  req,
  res
) => {

  try {

    const result =
      await terminateContractService(
        req.params.id
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