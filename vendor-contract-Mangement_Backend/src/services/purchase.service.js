import connectionPool from "../config/db.js";

export const createPurchaseOrderService = async (
  payload,
  userId
) => {

  const {
    vendor_id,
    contract_id,
    title,
    quantity,
    unit_price,
    tax_percent = 18,
    delivery_date
  } = payload;

  // ---------------- Vendor Validation ----------------

  const [vendor] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
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

  if (
    vendor[0].status !== "active"
  ) {
    throw new Error(
      "Vendor must be active"
    );
  }

  // ---------------- Contract Validation ----------------

  if (contract_id) {

    const [contract] =
      await connectionPool.execute(
        `
        SELECT
          id,
          status
        FROM contracts
        WHERE id = ?
        `,
        [contract_id]
      );

    if (contract.length === 0) {
      throw new Error(
        "Contract not found"
      );
    }

    if (
      contract[0].status !== "active"
    ) {
      throw new Error(
        "Contract must be active"
      );
    }
  }

  // ---------------- Quantity Validation ----------------

  if (
    Number(quantity) <= 0
  ) {
    throw new Error(
      "Quantity must be greater than zero"
    );
  }

  // ---------------- Unit Price Validation ----------------

  if (
    Number(unit_price) <= 0
  ) {
    throw new Error(
      "Unit price must be greater than zero"
    );
  }

  // ---------------- Tax Validation ----------------

  if (
    Number(tax_percent) < 0
  ) {
    throw new Error(
      "Tax percent cannot be negative"
    );
  }

  // ---------------- Amount Calculation ----------------

  const subTotal =
    Number(quantity) *
    Number(unit_price);

  const taxAmount =
    (subTotal *
      Number(tax_percent)) /
    100;

  const totalAmount =
    subTotal + taxAmount;

  // ---------------- Generate PO Number ----------------

  const poNumber =
    `PO-${Date.now()}`;

  // ---------------- Insert ----------------

  const [result] =
    await connectionPool.execute(
      `
      INSERT INTO purchase_orders
      (
        po_number,
        vendor_id,
        contract_id,
        title,
        quantity,
        unit_price,
        tax_percent,
        total_amount,
        delivery_date,
        raised_by
      )
      VALUES
      (
        ?,?,?,?,?,?,?,?,?,?
      )
      `,
      [
        poNumber,
        vendor_id,
        contract_id ?? null,
        title,
        quantity,
        unit_price,
        tax_percent,
        totalAmount,
        delivery_date,
        userId
      ]
    );

  return {
    poId: result.insertId,
    poNumber,
    message:
      "Purchase Order created successfully"
  };

};

export const getPurchaseOrdersService = async (
  page,
  limit,
  vendor_id,
  status
) => {

  let query = `
    SELECT
      po.id,
      po.po_number,
      po.title,
      po.quantity,
      po.unit_price,
      po.tax_percent,
      po.total_amount,
      po.delivery_date,
      po.status,
      po.created_at,
      v.company_name
    FROM purchase_orders po
    INNER JOIN vendors v
      ON po.vendor_id = v.id
    WHERE 1=1
  `;

  const params = [];

  // Vendor Filter

  if (vendor_id) {
    query += ` AND po.vendor_id = ?`;
    params.push(vendor_id);
  }

  // Status Filter

  if (status) {
    query += ` AND po.status = ?`;
    params.push(status);
  }

  // Count Query

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM purchase_orders po
    WHERE 1=1
  `;

  const countParams = [];

  if (vendor_id) {
    countQuery += ` AND po.vendor_id = ?`;
    countParams.push(vendor_id);
  }

  if (status) {
    countQuery += ` AND po.status = ?`;
    countParams.push(status);
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
    ORDER BY po.created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${offset}
  `;

  const [purchaseOrders] =
    await connectionPool.query(
      query,
      params
    );

  return {
    purchaseOrders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalRecords
    }
  };

};

export const getPurchaseOrderByIdService = async (
  poId
) => {

  const [purchaseOrder] =
    await connectionPool.execute(
      `
      SELECT
        po.id,
        po.po_number,
        po.title,
        po.quantity,
        po.unit_price,
        po.tax_percent,
        po.total_amount,
        po.delivery_date,
        po.status,
        po.created_at,

        v.id AS vendor_id,
        v.vendor_code,
        v.company_name,

        c.id AS contract_id,
        c.contract_number,
        c.title AS contract_title,

        u.id AS raised_by_id,
        u.name AS raised_by_name

      FROM purchase_orders po

      INNER JOIN vendors v
        ON po.vendor_id = v.id

      LEFT JOIN contracts c
        ON po.contract_id = c.id

      INNER JOIN users u
        ON po.raised_by = u.id

      WHERE po.id = ?
      `,
      [poId]
    );

  if (purchaseOrder.length === 0) {
    throw new Error(
      "Purchase Order not found"
    );
  }

  return purchaseOrder[0];

};

export const updatePurchaseOrderService = async (
  poId,
  payload
) => {

  const {
    vendor_id,
    contract_id,
    title,
    quantity,
    unit_price,
    tax_percent,
    delivery_date
  } = payload;

  // ---------- Check PO ----------

  const [purchaseOrder] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM purchase_orders
      WHERE id = ?
      `,
      [poId]
    );

  if (purchaseOrder.length === 0) {
    throw new Error(
      "Purchase Order not found"
    );
  }

  if (
    purchaseOrder[0].status !== "draft"
  ) {
    throw new Error(
      "Only draft purchase orders can be edited"
    );
  }

  // ---------- Vendor Validation ----------

  const [vendor] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
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

  if (
    vendor[0].status !== "active"
  ) {
    throw new Error(
      "Vendor must be active"
    );
  }

  // ---------- Contract Validation ----------

  if (contract_id) {

    const [contract] =
      await connectionPool.execute(
        `
        SELECT
          id,
          status
        FROM contracts
        WHERE id = ?
        `,
        [contract_id]
      );

    if (contract.length === 0) {
      throw new Error(
        "Contract not found"
      );
    }

    if (
      contract[0].status !== "active"
    ) {
      throw new Error(
        "Contract must be active"
      );
    }

  }

  // ---------- Quantity ----------

  if (Number(quantity) <= 0) {
    throw new Error(
      "Quantity must be greater than zero"
    );
  }

  // ---------- Unit Price ----------

  if (Number(unit_price) <= 0) {
    throw new Error(
      "Unit price must be greater than zero"
    );
  }

  // ---------- Tax ----------

  if (Number(tax_percent) < 0) {
    throw new Error(
      "Tax percent cannot be negative"
    );
  }

  // ---------- Recalculate Amount ----------

  const subTotal =
    Number(quantity) *
    Number(unit_price);

  const taxAmount =
    (subTotal *
      Number(tax_percent)) / 100;

  const totalAmount =
    subTotal + taxAmount;

  // ---------- Update ----------

  await connectionPool.execute(
    `
    UPDATE purchase_orders
    SET
      vendor_id = ?,
      contract_id = ?,
      title = ?,
      quantity = ?,
      unit_price = ?,
      tax_percent = ?,
      total_amount = ?,
      delivery_date = ?
    WHERE id = ?
    `,
    [
      vendor_id,
      contract_id ?? null,
      title,
      quantity,
      unit_price,
      tax_percent,
      totalAmount,
      delivery_date,
      poId
    ]
  );

  return {
    message:
      "Purchase Order updated successfully"
  };

};

export const updatePurchaseOrderStatusService = async (
  poId,
  newStatus
) => {

  const allowedStatus = [
    "draft",
    "sent",
    "fulfilled",
    "cancelled"
  ];

  if (!allowedStatus.includes(newStatus)) {
    throw new Error(
      "Invalid status"
    );
  }

  // ---------- Check PO ----------

  const [purchaseOrder] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM purchase_orders
      WHERE id = ?
      `,
      [poId]
    );

  if (purchaseOrder.length === 0) {
    throw new Error(
      "Purchase Order not found"
    );
  }

  const currentStatus =
    purchaseOrder[0].status;

  // ---------- Final Status Check ----------

  if (
    currentStatus === "fulfilled" ||
    currentStatus === "cancelled"
  ) {
    throw new Error(
      `Purchase Order is already ${currentStatus}`
    );
  }

  // ---------- Status Flow Validation ----------

  if (
    currentStatus === "draft" &&
    !["sent", "cancelled"].includes(newStatus)
  ) {
    throw new Error(
      "Draft PO can only move to sent or cancelled"
    );
  }

  if (
    currentStatus === "sent" &&
    !["fulfilled", "cancelled"].includes(newStatus)
  ) {
    throw new Error(
      "Sent PO can only move to fulfilled or cancelled"
    );
  }

  // ---------- Update ----------

  await connectionPool.execute(
    `
    UPDATE purchase_orders
    SET status = ?
    WHERE id = ?
    `,
    [
      newStatus,
      poId
    ]
  );

  return {
    message:
      `Purchase Order status updated to ${newStatus}`
  };

};

export const cancelPurchaseOrderService = async (
  poId
) => {

  // ---------- Check PO ----------

  const [purchaseOrder] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM purchase_orders
      WHERE id = ?
      `,
      [poId]
    );

  if (purchaseOrder.length === 0) {
    throw new Error(
      "Purchase Order not found"
    );
  }

  const currentStatus =
    purchaseOrder[0].status;

  // ---------- Already Cancelled ----------

  if (
    currentStatus === "cancelled"
  ) {
    throw new Error(
      "Purchase Order already cancelled"
    );
  }

  // ---------- Fulfilled ----------

  if (
    currentStatus === "fulfilled"
  ) {
    throw new Error(
      "Fulfilled Purchase Order cannot be cancelled"
    );
  }

  // ---------- Cancel ----------

  await connectionPool.execute(
    `
    UPDATE purchase_orders
    SET status = 'cancelled'
    WHERE id = ?
    `,
    [poId]
  );

  return {
    message:
      "Purchase Order cancelled successfully"
  };

};