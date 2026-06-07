
import {
  dashboardSummaryService,
  dashboardSpendingService,
  dashboardAlertsService,
  getAuditLogsService} 
  from "../services/dashboard.service.js"
export const getDashboardSummary =
async (
  req,
  res
) => {

  try {

    const result =
      await dashboardSummaryService();

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getDashboardSpending =
async (
  req,
  res
) => {

  try {

    const result =
      await dashboardSpendingService();

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
export const getDashboardAlerts =
async (
  req,
  res
) => {

  try {

    const result =
      await dashboardAlertsService();

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const getAuditLogs =
async (
  req,
  res
) => {

  try {

    const {
      page = 1,
      limit = 10,
      userId,
      entityType,
      action,
      fromDate,
      toDate
    } = req.query;

    const result =
      await getAuditLogsService(
        page,
        limit,
        userId,
        entityType,
        action,
        fromDate,
        toDate
      );

    return res.status(200).json({
      success: true,
      data: result.logs,
      pagination:
        result.pagination
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};