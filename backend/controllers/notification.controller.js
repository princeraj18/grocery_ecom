import Notification from "../models/notification.model.js";

// =====================================
// GET USER NOTIFICATIONS
// =====================================

export const getMyNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        notifications,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch notifications",
      });
    }
  };

// =====================================
// MARK NOTIFICATION AS READ
// =====================================

export const markNotificationAsRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {

        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        notification,
      });

    } catch (error) {

      console.log(
        "MARK READ ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to mark notification as read",
      });
    }
  };

// =====================================
// CREATE NOTIFICATION
// =====================================

export const createNotification =
  async ({
    user,
    title,
    message,
  }) => {

    try {

      const notification =
        await Notification.create({
          user,
          title,
          message,
        });

      return notification;

    } catch (error) {

      console.log(
        "CREATE NOTIFICATION ERROR:",
        error
      );
    }
  };