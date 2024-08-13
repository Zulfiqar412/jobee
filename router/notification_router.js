const express = require("express");
const notificationController = require("../controller/notification_controller");
const notificationRouter = express.Router();

notificationRouter.post(
  "/send-one-to-one-notification/:token",
  notificationController.sendOneToOneNotificationToSpecificUser
);

notificationRouter.post(
  "/send-one-to-many-notification",
  notificationController.send_notification_to_specific
);

module.exports = notificationRouter;
