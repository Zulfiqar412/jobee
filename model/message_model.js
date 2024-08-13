const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  timeSent: {
    type: Date,
    default: Date.now()
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  messageType: {
    type: String,
    required: true,
    enum: ["text", "video", "image", "voice"]
  },
  isSeen: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    required: true
  },
  repliedMessage: {
    type: String,
    default: ""
  },
  repliedTo: {
    type: String,
    default: ""
  },
  repliedMessageType: {
    type: String,
    default: ""
  }
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
