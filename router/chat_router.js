const express = require("express");
const chatController = require("../controller/chat_controller");
const chatRouter = express.Router();

chatRouter.post("/add-chat", chatController.addChat);
chatRouter.get("/get-all-chat/:id/:provider", chatController.getAllChat);

module.exports = chatRouter;
