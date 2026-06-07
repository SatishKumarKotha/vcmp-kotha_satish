import api from "../api/axios";

export const getInvoicesService =
async () => {

  const response =
    await api.get("/invoices");

  return response.data;
};

export const getInvoiceByIdService =
async (id) => {

  const response =
    await api.get(
      `/invoices/${id}`
    );

  return response.data.data;
};

export const createInvoiceService =
async (data) => {

  const response =
    await api.post(
      "/invoices",
      data
    );

  return response.data;
};

export const approveInvoiceService =
async (id) => {

  const response =
    await api.patch(
      `/invoices/${id}/approve`
    );

  return response.data;
};

export const markPaidInvoiceService =
async (
  id,
  payment_ref
) => {

  const response =
    await api.patch(
      `/invoices/${id}/mark-paid`,
      { payment_ref }
    );

  return response.data;
};

export const disputeInvoiceService =
async (
  id,
  dispute_reason
) => {

  const response =
    await api.patch(
      `/invoices/${id}/dispute`,
      { dispute_reason }
    );

  return response.data;
};