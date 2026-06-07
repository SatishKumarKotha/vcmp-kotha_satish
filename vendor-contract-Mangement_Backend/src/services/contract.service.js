import connectionPool from "../config/db.js";

export const createContractService = async (
  payload,
  userId
) => {

  const {
    vendor_id,
    title,
    value,
    currency = "INR",
    start_date,
    end_date,
    document_url
  } = payload;

  // -----------------------------
  // Validate Value
  // -----------------------------

  if (Number(value) <= 0) {
    throw new Error(
      "Contract value must be greater than 0"
    );
  }

  // -----------------------------
  // Validate Dates
  // -----------------------------

  const startDate =
    new Date(start_date);

  const endDate =
    new Date(end_date);

  if (endDate <= startDate) {
    throw new Error(
      "End date must be after start date"
    );
  }

  // -----------------------------
  // Check Vendor
  // -----------------------------

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

  // -----------------------------
  // Vendor must be ACTIVE
  // -----------------------------

  if (
    vendor[0].status !== "active"
  ) {
    throw new Error(
      "Vendor must be active before contract creation"
    );
  }

  // -----------------------------
  // Generate Contract Number
  // -----------------------------

  const contractNumber =
    `CON-${Date.now()}`;

  // -----------------------------
  // Insert Contract
  // -----------------------------

  const [result] =
    await connectionPool.execute(
      `
      INSERT INTO contracts
      (
        contract_number,
        vendor_id,
        title,
        value,
        currency,
        start_date,
        end_date,
        document_url,
        created_by
      )
      VALUES
      (
        ?,?,?,?,?,?,?,?,?
      )
      `,
      [
        contractNumber,
        vendor_id,
        title,
        value,
        currency,
        start_date,
        end_date,
        document_url,
        userId
      ]
    );

  return {
    contractId:
      result.insertId,
    contractNumber,
    message:
      "Contract created successfully"
  };

};

export const getContractsService = async (
  page,
  limit,
  vendor_id,
  status,
  start_date,
  end_date
) => {

  let query = `
    SELECT
      c.id,
      c.contract_number,
      c.title,
      c.value,
      c.currency,
      c.start_date,
      c.end_date,
      c.status,
      c.created_at,
      v.company_name
    FROM contracts c
    INNER JOIN vendors v
      ON c.vendor_id = v.id
    WHERE 1=1
  `;

  const params = [];

  // Vendor Filter

  if (vendor_id) {
    query += ` AND c.vendor_id = ?`;
    params.push(vendor_id);
  }

  // Status Filter

  if (status) {
    query += ` AND c.status = ?`;
    params.push(status);
  }

  // Start Date Filter

  if (start_date) {
    query += ` AND c.start_date >= ?`;
    params.push(start_date);
  }

  // End Date Filter

  if (end_date) {
    query += ` AND c.end_date <= ?`;
    params.push(end_date);
  }

  // Count Query

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM contracts c
    WHERE 1=1
  `;

  const countParams = [];

  if (vendor_id) {
    countQuery += ` AND c.vendor_id = ?`;
    countParams.push(vendor_id);
  }

  if (status) {
    countQuery += ` AND c.status = ?`;
    countParams.push(status);
  }

  if (start_date) {
    countQuery += ` AND c.start_date >= ?`;
    countParams.push(start_date);
  }

  if (end_date) {
    countQuery += ` AND c.end_date <= ?`;
    countParams.push(end_date);
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

  // MySQL LIMIT/OFFSET issue with execute()
  query += `
    ORDER BY c.created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}
  `;

  const [contracts] =
    await connectionPool.query(
      query,
      params
    );

  return {
    contracts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalRecords
    }
  };

};

export const getContractByIdService = async (
  contractId
) => {

  const [contract] =
    await connectionPool.execute(
      `
      SELECT
        c.id,
        c.contract_number,
        c.title,
        c.value,
        c.currency,
        c.start_date,
        c.end_date,
        c.status,
        c.document_url,
        c.created_at,

        v.id AS vendor_id,
        v.vendor_code,
        v.company_name,

        creator.id AS created_by_id,
        creator.name AS created_by_name,

        approver.id AS approved_by_id,
        approver.name AS approved_by_name,

        c.approved_at

      FROM contracts c

      INNER JOIN vendors v
        ON c.vendor_id = v.id

      INNER JOIN users creator
        ON c.created_by = creator.id

      LEFT JOIN users approver
        ON c.approved_by = approver.id

      WHERE c.id = ?
      `,
      [contractId]
    );

  if (contract.length === 0) {
    throw new Error(
      "Contract not found"
    );
  }

  return contract[0];

};

export const updateContractService = async (
  contractId,
  payload
) => {

  const {
    title,
    value,
    currency,
    start_date,
    end_date,
    document_url
  } = payload;

  // ---------------- Check Contract ----------------

  const [contract] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM contracts
      WHERE id = ?
      `,
      [contractId]
    );

  if (contract.length === 0) {
    throw new Error(
      "Contract not found"
    );
  }

  // ---------------- Draft Only ----------------

  if (
    contract[0].status !== "draft"
  ) {
    throw new Error(
      "Only draft contracts can be edited"
    );
  }

  // ---------------- Value Validation ----------------

  if (Number(value) <= 0) {
    throw new Error(
      "Contract value must be greater than 0"
    );
  }

  // ---------------- Date Validation ----------------

  const startDate =
    new Date(start_date);

  const endDate =
    new Date(end_date);

  if (endDate <= startDate) {
    throw new Error(
      "End date must be after start date"
    );
  }

  // ---------------- Update ----------------

  await connectionPool.execute(
    `
    UPDATE contracts
    SET
      title = ?,
      value = ?,
      currency = ?,
      start_date = ?,
      end_date = ?,
      document_url = ?
    WHERE id = ?
    `,
    [
      title,
      value,
      currency,
      start_date,
      end_date,
      document_url ?? null,
      contractId
    ]
  );

  return {
    message:
      "Contract updated successfully"
  };

};

export const approveContractService = async (
  contractId,
  approvedBy
) => {

  // ---------- Check Contract ----------

  const [contract] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM contracts
      WHERE id = ?
      `,
      [contractId]
    );

  if (contract.length === 0) {
    throw new Error(
      "Contract not found"
    );
  }

  // ---------- Only Draft ----------

  if (
    contract[0].status !== "draft"
  ) {
    throw new Error(
      "Only draft contracts can be approved"
    );
  }

  // ---------- Approve ----------

  await connectionPool.execute(
    `
    UPDATE contracts
    SET
      status = 'active',
      approved_by = ?,
      approved_at = NOW()
    WHERE id = ?
    `,
    [
      approvedBy,
      contractId
    ]
  );

  return {
    message:
      "Contract approved successfully"
  };

};


export const terminateContractService = async (
  contractId
) => {

  // ---------- Check Contract ----------

  const [contract] =
    await connectionPool.execute(
      `
      SELECT
        id,
        status
      FROM contracts
      WHERE id = ?
      `,
      [contractId]
    );

  if (contract.length === 0) {
    throw new Error(
      "Contract not found"
    );
  }

  // ---------- Must be Active ----------

  if (
    contract[0].status !== "active"
  ) {
    throw new Error(
      "Only active contracts can be terminated"
    );
  }

  // ---------- Update Status ----------

  await connectionPool.execute(
    `
    UPDATE contracts
    SET status = 'terminated'
    WHERE id = ?
    `,
    [contractId]
  );

  return {
    message:
      "Contract terminated successfully"
  };

};