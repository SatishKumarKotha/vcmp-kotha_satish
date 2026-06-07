import api from "../api/axios";

export const getNotificationsService =
async () => {

  const response =
    await api.get(
      "/notifications"
    );

  return response.data;
};

export const markNotificationReadService =
async (id) => {

  const response =
    await api.patch(
      `/notifications/${id}/read`
    );

  return response.data;
};