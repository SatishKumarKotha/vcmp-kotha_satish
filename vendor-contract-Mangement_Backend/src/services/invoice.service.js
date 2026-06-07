import connectionPool from "../config/db.js";
export const createInvoiceService = async (
  payload
) => {

  const {
    invoice_number,
    po_id,
    vendor_id,
    amount,
    tax_amount,
    invoice_date,
    due_date
  } = payload;

  // ---------- Invoice Exists ----------

  const [existingInvoice] =
    await connectionPool.execute(
      `
      SELECT id
      FROM invoices
      WHERE invoice_number = ?
      `,
      [invoice_number]
    );

  if (existingInvoice.length > 0) {
    throw new Error(
      "Invoice number already exists"
    );
  }

  // ---------- PO Validation ----------

  const [purchaseOrder] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM purchase_orders
      WHERE id = ?
      `,
      [po_id]
    );

  if (purchaseOrder.length === 0) {
    throw new Error(
      "Purchase Order not found"
    );
  }

  if (
    purchaseOrder[0].status !== "fulfilled"
  ) {
    throw new Error(
      "Invoice can only be raised for fulfilled PO"
    );
  }

  // ---------- Vendor Validation ----------

  const [vendor] =
    await connectionPool.execute(
      `
      SELECT id
      FROM vendors
      WHERE id = ?
      `,
      [vendor_id]
    );

  if (vendor.length === 0) {
    throw new Error(
      "Vendor not found"
    );
  }

  // ---------- Amount Validation ----------

  if (Number(amount) <= 0) {
    throw new Error(
      "Amount must be greater than zero"
    );
  }

  if (Number(tax_amount) < 0) {
    throw new Error(
      "Invalid tax amount"
    );
  }

  // ---------- Date Validation ----------

  if (
    new Date(due_date) <
    new Date(invoice_date)
  ) {
    throw new Error(
      "Due date cannot be before invoice date"
    );
  }

  // ---------- Total ----------

  const totalAmount =
    Number(amount) +
    Number(tax_amount);

  // ---------- Insert ----------

  const [result] =
    await connectionPool.execute(
      `
      INSERT INTO invoices
      (
        invoice_number,
        po_id,
        vendor_id,
        amount,
        tax_amount,
        total_amount,
        invoice_date,
        due_date
      )
      VALUES
      (
        ?,?,?,?,?,?,?,?
      )
      `,
      [
        invoice_number,
        po_id,
        vendor_id,
        amount,
        tax_amount,
        totalAmount,
        invoice_date,
        due_date
      ]
    );

  return {
    invoiceId: result.insertId,
    message:
      "Invoice created successfully"
  };

};

export const getInvoicesService = async (
  page,
  limit,
  status,
  fromDate,
  toDate
) => {

  let query = `
    SELECT
      i.id,
      i.invoice_number,
      i.amount,
      i.tax_amount,
      i.total_amount,
      i.invoice_date,
      i.due_date,
      i.paid_date,
      i.status,

      po.po_number,

      v.company_name,

      CASE
        WHEN i.status != 'paid'
         AND i.due_date < CURDATE()
        THEN TRUE
        ELSE FALSE
      END AS is_overdue

    FROM invoices i

    INNER JOIN purchase_orders po
      ON i.po_id = po.id

    INNER JOIN vendors v
      ON i.vendor_id = v.id

    WHERE 1=1
  `;

  const params = [];

  // ---------- Status ----------

  if (status) {
    query += ` AND i.status = ?`;
    params.push(status);
  }

  // ---------- From Date ----------

  if (fromDate) {
    query += `
      AND i.invoice_date >= ?
    `;
    params.push(fromDate);
  }

  // ---------- To Date ----------

  if (toDate) {
    query += `
      AND i.invoice_date <= ?
    `;
    params.push(toDate);
  }

  // ---------- Count Query ----------

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM invoices i
    WHERE 1=1
  `;

  const countParams = [];

  if (status) {
    countQuery += ` AND i.status = ?`;
    countParams.push(status);
  }

  if (fromDate) {
    countQuery += `
      AND i.invoice_date >= ?
    `;
    countParams.push(fromDate);
  }

  if (toDate) {
    countQuery += `
      AND i.invoice_date <= ?
    `;
    countParams.push(toDate);
  }

  const [countResult] =
    await connectionPool.execute(
      countQuery,
      countParams
    );

  const totalRecords =
    countResult[0].total;

  const offset =
    (Number(page) - 1) *
    Number(limit);

  query += `
    ORDER BY i.created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${offset}
  `;

  const [invoices] =
    await connectionPool.query(
      query,
      params
    );

  return {
    invoices,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalRecords
    }
  };

};

export const getInvoiceByIdService = async (
  invoiceId
) => {

  const [invoice] =
    await connectionPool.execute(
      `
      SELECT

        i.id,
        i.invoice_number,
        i.amount,
        i.tax_amount,
        i.total_amount,
        i.invoice_date,
        i.due_date,
        i.paid_date,
        i.status,
        i.payment_ref,
        i.created_at,

        po.id AS po_id,
        po.po_number,
        po.title AS po_title,

        v.id AS vendor_id,
        v.vendor_code,
        v.company_name,

        u.id AS reviewer_id,
        u.name AS reviewer_name

      FROM invoices i

      INNER JOIN purchase_orders po
        ON i.po_id = po.id

      INNER JOIN vendors v
        ON i.vendor_id = v.id

      LEFT JOIN users u
        ON i.reviewed_by = u.id

      WHERE i.id = ?
      `,
      [invoiceId]
    );

  if (invoice.length === 0) {
    throw new Error(
      "Invoice not found"
    );
  }

  return invoice[0];

};

export const approveInvoiceService = async (
  invoiceId,
  reviewerId
) => {

  const [invoice] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM invoices
      WHERE id = ?
      `,
      [invoiceId]
    );

  if (invoice.length === 0) {
    throw new Error(
      "Invoice not found"
    );
  }

  const currentStatus =
    invoice[0].status;

  if (currentStatus !== "pending") {
    throw new Error(
      "Only pending invoices can be approved"
    );
  }

  await connectionPool.execute(
    `
    UPDATE invoices
    SET
      status = 'approved',
      reviewed_by = ?
    WHERE id = ?
    `,
    [
      reviewerId,
      invoiceId
    ]
  );

  return {
    message:
      "Invoice approved successfully"
  };

};

export const markInvoicePaidService = async (
  invoiceId,
  paymentRef,
  reviewerId
) => {

  // ---------- Validation ----------

  if (!paymentRef) {
    throw new Error(
      "Payment reference is required"
    );
  }

  // ---------- Fetch Invoice ----------

  const [invoice] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM invoices
      WHERE id = ?
      `,
      [invoiceId]
    );

  if (invoice.length === 0) {
    throw new Error(
      "Invoice not found"
    );
  }

  const currentStatus =
    invoice[0].status;

  // ---------- Status Validation ----------

  if (currentStatus !== "approved") {
    throw new Error(
      "Only approved invoices can be marked as paid"
    );
  }

  // ---------- Update ----------

  await connectionPool.execute(
    `
    UPDATE invoices
    SET
      status = 'paid',
      payment_ref = ?,
      paid_date = CURDATE(),
      reviewed_by = ?
    WHERE id = ?
    `,
    [
      paymentRef,
      reviewerId,
      invoiceId
    ]
  );

  return {
    message:
      "Invoice marked as paid successfully"
  };

};

export const disputeInvoiceService = async (
  invoiceId,
  disputeReason,
  reviewerId
) => {

  // ---------- Validation ----------

  if (!disputeReason) {
    throw new Error(
      "Dispute reason is required"
    );
  }

  // ---------- Invoice ----------

  const [invoice] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM invoices
      WHERE id = ?
      `,
      [invoiceId]
    );

  if (invoice.length === 0) {
    throw new Error(
      "Invoice not found"
    );
  }

  const currentStatus =
    invoice[0].status;

  // ---------- Paid ----------

  if (currentStatus === "paid") {
    throw new Error(
      "Paid invoice cannot be disputed"
    );
  }

  // ---------- Already Disputed ----------

  if (currentStatus === "disputed") {
    throw new Error(
      "Invoice already disputed"
    );
  }

  // ---------- Update ----------

  await connectionPool.execute(
    `
    UPDATE invoices
    SET
      status = 'disputed',
      reviewed_by = ?
    WHERE id = ?
    `,
    [
      reviewerId,
      invoiceId
    ]
  );

  return {
    message:
      "Invoice marked as disputed successfully"
  };

};