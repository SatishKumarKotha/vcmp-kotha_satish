import api from "../api/axios";

export const getSummaryService =
  async () => {

    const response =
      await api.get(
        "/dashboard/summary"
      );

    return response.data;
  };

export const getSpendingService =
  async () => {

    const response =
      await api.get(
        "/dashboard/spending"
      );

    return response.data;
  };

export const getAlertsService =
  async () => {

    const response =
      await api.get(
        "/dashboard/alerts"
      );

    return response.data;
  };