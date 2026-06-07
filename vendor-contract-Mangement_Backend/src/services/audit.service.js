
import connectionPool from "../config/db.js";

export const createAuditLog =
async (
  userId,
  action,
  entityType,
  entityId
) => {

  await connectionPool.execute(
    `
    INSERT INTO audit_logs
    (
      user_id,
      action,
      entity_type,
      entity_id
    )
    VALUES
    (?, ?, ?, ?)
    `,
    [
      userId,
      action,
      entityType,
      entityId
    ]
  );

};


export const getAuditLogsService =
async (
  entityType = null
) => {

  let sql = `
    SELECT
      a.id,
      a.action,
      a.entity_type,
      a.entity_id,
      a.created_at,
      u.name
    FROM audit_logs a
    INNER JOIN users u
      ON a.user_id = u.id
  `;

  const params = [];

  if (entityType) {

    sql += `
      WHERE a.entity_type = ?
    `;

    params.push(
      entityType
    );

  }

  sql += `
    ORDER BY a.created_at DESC
  `;

  const [logs] =
    await connectionPool.execute(
      sql,
      params
    );

  return logs;

};