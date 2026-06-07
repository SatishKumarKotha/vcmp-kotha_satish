import {
  getNotificationsService,
  markNotificationReadService
} from "../services/notification.service.js";

export const getNotifications =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const notifications =
      await getNotificationsService(
        userId
      );

    return res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

export const markNotificationRead =
async (req, res) => {

  try {

    const { id } =
      req.params;

    await markNotificationReadService(
      id
    );

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

};