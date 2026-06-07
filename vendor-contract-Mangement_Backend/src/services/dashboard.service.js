import connectionPool from "../config/db.js";

export const dashboardSummaryService =
async () => {

  const [[vendors]] =
    await connectionPool.execute(
      `
      SELECT COUNT(*) total
      FROM vendors
      `
    );

  const [[contracts]] =
    await connectionPool.execute(
      `
      SELECT COUNT(*) total
      FROM contracts
      WHERE status = 'active'
      `
    );

  const [[purchaseOrders]] =
    await connectionPool.execute(
      `
      SELECT COUNT(*) total
      FROM purchase_orders
      WHERE status IN
      ('draft','sent')
      `
    );

  const [[invoices]] =
    await connectionPool.execute(
      `
      SELECT COUNT(*) total
      FROM invoices
      WHERE status != 'paid'
      AND due_date < CURDATE()
      `
    );

  return {
    totalVendors:
      vendors.total,

    activeContracts:
      contracts.total,

    openPurchaseOrders:
      purchaseOrders.total,

    overdueInvoices:
      invoices.total
  };

};

export const dashboardSpendingService =
async () => {

  const [rows] =
    await connectionPool.execute(
      `
      SELECT

      DATE_FORMAT(
        paid_date,
        '%Y-%m'
      ) month,

      SUM(total_amount)
      totalSpend

      FROM invoices

      WHERE status='paid'

      GROUP BY month

      ORDER BY month
      `
    );

  return rows;

};

export const dashboardAlertsService =
async () => {

  const [contracts] =
    await connectionPool.execute(
      `
      SELECT
        id,
        contract_number,
        title,
        end_date
      FROM contracts
      WHERE status='active'
      AND end_date BETWEEN
      CURDATE()
      AND DATE_ADD(
        CURDATE(),
        INTERVAL 30 DAY
      )
      `
    );

  const [invoices] =
    await connectionPool.execute(
      `
      SELECT
        id,
        invoice_number,
        due_date,
        total_amount
      FROM invoices
      WHERE status != 'paid'
      AND due_date < CURDATE()
      `
    );

  return {
    expiringContracts:
      contracts,

    overdueInvoices:
      invoices
  };

};

export const getAuditLogsService =
async (
  page,
  limit,
  userId,
  entityType,
  action,
  fromDate,
  toDate
) => {

  let query = `
    SELECT

      al.id,
      al.user_id,
      u.name AS user_name,

      al.action,
      al.entity_type,
      al.entity_id,

      al.old_value,
      al.new_value,

      al.ip_address,
      al.created_at

    FROM audit_logs al

    INNER JOIN users u
      ON al.user_id = u.id

    WHERE 1=1
  `;

  const params = [];

  // ---------- User Filter ----------

  if (userId) {
    query += `
      AND al.user_id = ?
    `;
    params.push(userId);
  }

  // ---------- Entity Filter ----------

  if (entityType) {
    query += `
      AND al.entity_type = ?
    `;
    params.push(entityType);
  }

  // ---------- Action Filter ----------

  if (action) {
    query += `
      AND al.action = ?
    `;
    params.push(action);
  }

  // ---------- Date Filter ----------

  if (fromDate) {
    query += `
      AND DATE(al.created_at) >= ?
    `;
    params.push(fromDate);
  }

  if (toDate) {
    query += `
      AND DATE(al.created_at) <= ?
    `;
    params.push(toDate);
  }

  // ---------- Count Query ----------

  let countQuery = `
    SELECT COUNT(*) total
    FROM audit_logs al
    WHERE 1=1
  `;

  const countParams = [];

  if (userId) {
    countQuery += `
      AND al.user_id = ?
    `;
    countParams.push(userId);
  }

  if (entityType) {
    countQuery += `
      AND al.entity_type = ?
    `;
    countParams.push(entityType);
  }

  if (action) {
    countQuery += `
      AND al.action = ?
    `;
    countParams.push(action);
  }

  if (fromDate) {
    countQuery += `
      AND DATE(al.created_at) >= ?
    `;
    countParams.push(fromDate);
  }

  if (toDate) {
    countQuery += `
      AND DATE(al.created_at) <= ?
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

  // ---------- Pagination ----------

  const offset =
    (Number(page) - 1) *
    Number(limit);

  query += `
    ORDER BY al.created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${offset}
  `;

  const [logs] =
    await connectionPool.query(
      query,
      params
    );

  return {
    logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalRecords,
      totalPages: Math.ceil(
        totalRecords /
        Number(limit)
      )
    }
  };

};