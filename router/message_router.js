const express = require("express");
const messageController = require("../controller/message_controller");
const messageRouter = express.Router();

messageRouter.post("/send-message", messageController.sendMessage);

messageRouter.get("/get-all-message/:senderId/:receiverId/:contactId", messageController.getAllMessages);

module.exports = messageRouter;
