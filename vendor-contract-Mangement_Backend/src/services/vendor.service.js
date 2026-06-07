 
import connectionPool from "../config/db.js"

export const getVendorByIdService =async (vendorId) => {

  // Vendor Details

  const [vendors] =
  await connectionPool.execute(
    `
    SELECT
      id,
      vendor_code,
      company_name,
      contact_person,
      email,
      phone,
      gstin,
      address,
      category,
      status,
      rejection_reason,
      approved_at,
      created_at
    FROM vendors
    WHERE id = ?
    `,
    [vendorId]
  );

  if (vendors.length === 0) {
    throw new Error("Vendor not found");
  }

  // Contracts

  const [contracts] =
  await connectionPool.execute(
    `
    SELECT
      id,
      contract_number,
      title,
      value,
      currency,
      start_date,
      end_date,
      status,
      document_url
    FROM contracts
    WHERE vendor_id = ?
    ORDER BY created_at DESC
    `,
    [vendorId]
  );

  // Purchase Orders

  const [purchaseOrders] =
  await connectionPool.execute(
    `
    SELECT
      id,
      po_number,
      contract_id,
      title,
      quantity,
      unit_price,
      tax_percent,
      total_amount,
      delivery_date,
      status
    FROM purchase_orders
    WHERE vendor_id = ?
    ORDER BY created_at DESC
    `,
    [vendorId]
  );

  return {
    vendor: vendors[0],
    contracts,
    purchaseOrders
  };
};


export const createVendorService =async (
  payload,
  userId
) => {

  const {
    company_name,
    contact_person,
    email,
    phone,
    gstin,
    address,
    category
  } = payload;

  const [existingVendor] =
  await connectionPool.execute(
    `
    SELECT id
    FROM vendors
    WHERE email = ?
    `,
    [email]
  );

  if (existingVendor.length > 0) {
    throw new Error(
      "Vendor email already exists"
    );
  }

  const vendorCode =
  `VEN-${Date.now()}`;

  const [result] =
  await connectionPool.execute(
    `
    INSERT INTO vendors
    (
      vendor_code,
      company_name,
      contact_person,
      email,
      phone,
      gstin,
      address,
      category,
      onboarded_by
    )
    VALUES
    (
      ?,?,?,?,?,?,?,?,?
    )
    `,
    [
      vendorCode,
      company_name,
      contact_person,
      email,
      phone,
      gstin,
      address,
      category,
      userId
    ]
  );

  return {
    vendorId: result.insertId,
    message:
      "Vendor created successfully"
  };

};

export const approveVendorService =async (
  vendorId,
  adminId
) => {

  const [vendor] =
  await connectionPool.execute(
    `
    SELECT id
    FROM vendors
    WHERE id = ?
    `,
    [vendorId]
  );

  if (vendor.length === 0) {
    throw new Error(
      "Vendor not found"
    );
  }

  await connectionPool.execute(
    `
    UPDATE vendors
    SET
      status='active',
      approved_by=?,
      approved_at=NOW()
    WHERE id=?
    `,
    [
      adminId,
      vendorId
    ]
  );

  return {
    message:
      "Vendor approved successfully"
  };

};

export const updateVendorStatusService =async (
  vendorId,
  status
) => {

  await connectionPool.execute(
    `
    UPDATE vendors
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      vendorId
    ]
  );

  return {
    message:
      "Vendor status updated successfully"
  };

};

export const deleteVendorService =async (vendorId) => {

  await connectionPool.execute(
    `
    UPDATE vendors
    SET status = 'inactive'
    WHERE id = ?
    `,
    [vendorId]
  );

  return {
    message:
      "Vendor deleted successfully"
  };

};

export const getVendorsService = async ( page,limit, search,status,category) => {

  let query = `  SELECT   id,vendor_code, company_name,   contact_person, email,  phone, category,status,gstin,  created_at
                              FROM vendors
                              WHERE 1=1
                            `;

  const params = [];

  //-------Search Input --------------\\

  if (search) {

    query += `
      AND (
        company_name LIKE ?
        OR contact_person LIKE ?
        OR email LIKE ?
      )
    `;

    params.push(`%${search}%`);
    params.push(`%${search}%`);
    params.push(`%${search}%`);
  }

  //-----------Vendor Status ------------------\\

  if (status) {

    query += `
      AND status = ?
    `;

    params.push(status);
  }

  //---------------Category -------------------\\

  if (category) {

    query += `
      AND category = ?
    `;

    params.push(category);
  }

  //------------Count Query---------------------\\

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM vendors
    WHERE 1=1
  `;

  const countParams = [];

  if (search) {

    countQuery += `
      AND (
        company_name LIKE ?
        OR contact_person LIKE ?
        OR email LIKE ?
      )
    `;

    countParams.push(`%${search}%`);
    countParams.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }

  if (status) {

    countQuery += `
      AND status = ?
    `;

    countParams.push(status);
  }

  if (category) {

    countQuery += `
      AND category = ?
    `;

    countParams.push(category);
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
    ORDER BY created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}
  `;

  const [vendors] =
    await connectionPool.query(
      query,
      params
    );

  return {

    vendors,

    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalRecords
    }

  };

};
export const deleteVendor = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const result =
      await deleteVendorService(id);

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const updateVendorService =
async (
  vendorId,
  payload
) => {

  const {
    company_name,
    contact_person,
    email,
    phone,
    gstin,
    address,
    category
  } = payload;

  const [vendor] =
    await connectionPool.execute(
      `
      SELECT id
      FROM vendors
      WHERE id = ?
      `,
      [vendorId]
    );

  if (vendor.length === 0) {
    throw new Error(
      "Vendor not found"
    );
  }

  await connectionPool.execute(
    `
    UPDATE vendors
    SET
      company_name=?,
      contact_person=?,
      email=?,
      phone=?,
      gstin=?,
      address=?,
      category=?
    WHERE id=?
    `,
    [
      company_name,
      contact_person,
      email,
      phone,
      gstin,
      address,
      category,
      vendorId
    ]
  );

  return {
    message:
      "Vendor updated successfully"
  };

};