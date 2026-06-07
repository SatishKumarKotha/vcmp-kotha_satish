import api from "../api/axios";

export const getAuditLogsService =
async (entityType = "") => {

  const response =
    await api.get(
      "/audit-logs",
      {
        params: {
          entityType
        }
      }
    );

  return response.data;
};