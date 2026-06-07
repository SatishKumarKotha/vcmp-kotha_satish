import {
  getAuditLogsService
} from "../services/audit.service.js";

export const getAuditLogs =
async (req, res) => {

  try {

    const {
      entityType
    } = req.query;

    const logs =
      await getAuditLogsService(
        entityType
      );

    return res.status(200).json({
      success: true,
      data: logs
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};