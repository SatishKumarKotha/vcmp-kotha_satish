import connectionPool from "../config/db.js";
import bcrypt from "bcrypt";   // forpassword hashing


export const getUsersService = async (  page,limit,search,role, status) => {

  let query = `
    SELECT
      id,
      name,
      email,
      role,
      status,
      created_at
    FROM users
    WHERE 1=1
  `;

  const params = [];

  //--------Search----------------\\
  if (search) {
    query += ` AND (name LIKE ? OR email LIKE ?)`;
    params.push(`%${search}%`);
    params.push(`%${search}%`);
  }

  //----------Role Filter----------------\\
  if (role) {
    query += ` AND role = ?`;
    params.push(role);
  }

  //--------------------Status Filter--------------------\\
  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  // ---------------- Count Query ----------------\\
console.log("BEFORE COUNT");
  let countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    WHERE 1=1
  `;

  const countParams = [];

  if (search) {
    countQuery += ` AND (name LIKE ? OR email LIKE ?)`;
    countParams.push(`%${search}%`);
    countParams.push(`%${search}%`);
  }

  if (role) {
    countQuery += ` AND role = ?`;
    countParams.push(role);
  }

  if (status) {
    countQuery += ` AND status = ?`;
    countParams.push(status);
  }
console.log("AFTER COUNT");

console.log("BEFORE USERS");
  const [countResult] = await connectionPool.execute(
    countQuery,
    countParams
  );

  const totalUsers = countResult[0].total;

  // ---------------- Pagination ----------------\\

  const offset = (Number(page) - 1) * Number(limit);

query += `
    ORDER BY created_at DESC
    LIMIT ${Number(limit)}
    OFFSET ${Number(offset)}
`;

  // ---------------- Fetch Users ----------------
console.log("QUERY => ", query);
console.log("PARAMS => ", params);
  const [users] = await connectionPool.query(
  query,
  params
);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalUsers
    }
  };
};

export const createUserService = async (
  name,
  email,
  password,
  role
) => {

  const [existingUser] =
    await connectionPool.execute(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [email]
    );

  if (existingUser.length > 0) {
    throw new Error(
      "Email already exists"
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const [result] =
    await connectionPool.execute(
      `
      INSERT INTO users
      (
        name,
        email,
        password_hash,
        role
      )
      VALUES
      (
        ?, ?, ?, ?
      )
      `,
      [
        name,
        email,
        passwordHash,
        role
      ]
    );

  return {
    userId: result.insertId,
    message:
      "User created successfully"
  };
};

export const getUserByIdService =async (id) => {

    const [users] =
      await connectionPool.execute(
        `
        SELECT
          id,
          name,
          email,
          role,
          status,
          created_at
        FROM users
        WHERE id = ?
        `,
        [id]
      );

    if (users.length === 0) {
      throw new Error(
        "User not found"
      );
    }

    return users[0];
  };

  export const updateUserService =async (
    id,
    name,
    role,
    status
  ) => {

    const [users] =
      await connectionPool.execute(
        `
        SELECT id
        FROM users
        WHERE id = ?
        `,
        [id]
      );

    if (users.length === 0) {
      throw new Error(
        "User not found"
      );
    }

    await connectionPool.execute(
      `
      UPDATE users
      SET
        name = ?,
        role = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name,
        role,
        status,
        id
      ]
    );

    return {
      message:
        "User updated successfully"
    };
  };

  export const deleteUserService =async (id) => {

    const [users] =
      await connectionPool.execute(
        `
        SELECT id
        FROM users
        WHERE id = ?
        `,
        [id]
      );

    if (users.length === 0) {
      throw new Error(
        "User not found"
      );
    }

    await connectionPool.execute(
      `
      UPDATE users
      SET status = 'inactive'
      WHERE id = ?
      `,
      [id]
    );

    return {
      message:
        "User deleted successfully"
    };
  };