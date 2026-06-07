import connectionPool from "../config/db.js";

export const getNotificationsService =
async (userId) => {

  const [notifications] =
    await connectionPool.execute(
      `
      SELECT
        id,
        title,
        message,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

  return notifications;

};

export const markNotificationReadService =
async (id) => {

  await connectionPool.execute(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ?
    `,
    [id]
  );

};

export const createNotificationService =
async (
  userId,
  title,
  message
) => {

  await connectionPool.execute(
    `
    INSERT INTO notifications
    (
      user_id,
      title,
      message
    )
    VALUES
    (?, ?, ?)
    `,
    [
      userId,
      title,
      message
    ]
  );

};