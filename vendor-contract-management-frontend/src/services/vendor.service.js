import api from "../api/axios";

export const getVendorsService =
async () => {

  const response =
    await api.get("/vendors");

  return response.data;
};

export const getVendorByIdService =
async (id) => {

  const response =
    await api.get(`/vendors/${id}`);

  return response.data.data;
};

export const createVendorService =
async (data) => {

  const response =
    await api.post(
      "/vendors",
      data
    );

  return response.data;
};

export const updateVendorService = async (id, data) => {
  const response = await api.patch(`/vendors/${id}`, data);
  return response.data;
};

export const deleteVendorService =
async (id) => {

  const response =
    await api.delete(
      `/vendors/${id}`
    );

  return response.data;
};

export const approveVendorService =
async (id) => {

  const response =
    await api.patch(
      `/vendors/${id}/approve`
    );

  return response.data;
};

export const updateVendorStatusService =
async (id, status) => {

  const response =
    await api.patch(
      `/vendors/${id}/status`,
      { status }
    );

  return response.data;
};