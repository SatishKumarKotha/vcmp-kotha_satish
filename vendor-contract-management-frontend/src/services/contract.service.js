import api from "../api/axios";

export const getContractsService =
async () => {

  const response =
    await api.get("/contracts");

  return response.data;
};

export const getContractByIdService =
async (id) => {

  const response =
    await api.get(
      `/contracts/${id}`
    );

  return response.data.data;
};

export const createContractService =
async (data) => {

  const response =
    await api.post(
      "/contracts",
      data
    );

  return response.data;
};

export const updateContractService =
async (id, data) => {

  const response =
    await api.patch(
      `/contracts/${id}`,
      data
    );

  return response.data;
};

export const approveContractService =
async (id) => {

  const response =
    await api.patch(
      `/contracts/${id}/approve`
    );

  return response.data;
};

export const terminateContractService =
async (id) => {

  const response =
    await api.patch(
      `/contracts/${id}/terminate`
    );

  return response.data;
};