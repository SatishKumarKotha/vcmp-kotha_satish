import api from "../api/axios";

export const getUsersService =
async () => {

  const response =
    await api.get("/users");

  return response.data;
};

export const getUserByIdService =
async (id) => {

  const response =
    await api.get(`/users/${id}`);

  return response.data.data;
};

export const createUserService =
async (data) => {

  const response =
    await api.post(
      "/users",
      data
    );

  return response.data;
};

export const updateUserService =
async (id, data) => {

  const response =
    await api.patch(
      `/users/${id}`,
      data
    );

  return response.data;
};

export const updateUserStatusService =
async (
  id,
  status
) => {

  const response =
    await api.patch(
      `/users/${id}/status`,
      { status }
    );

  return response.data;
};