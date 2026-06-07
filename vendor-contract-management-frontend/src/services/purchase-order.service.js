
import api from "../api/axios";
export const getPurchaseOrdersService =
async () => {

  const response =
    await api.get(
      "/purchase-orders"
    );

  return response.data;
};

export const getPurchaseOrderByIdService =
async (id) => {

  const response =
    await api.get(
      `/purchase-orders/${id}`
    );

  return response.data.data;
};

export const createPurchaseOrderService =
async (data) => {

  const response =
    await api.post(
      "/purchase-orders",
      data
    );

  return response.data;
};

export const updatePurchaseOrderService =
async (id, data) => {

  const response =
    await api.patch(
      `/purchase-orders/${id}`,
      data
    );

  return response.data;
};

export const updatePurchaseOrderStatusService =
async (id, status) => {

  const response =
    await api.patch(
      `/purchase-orders/${id}/status`,
      { status }
    );

  return response.data;
};

export const deletePurchaseOrderService =
async (id) => {

  const response =
    await api.delete(
      `/purchase-orders/${id}`
    );

  return response.data;
};