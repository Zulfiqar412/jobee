const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  profilePic: {
    type: String
  },

  name: {
    type: String
  },

  timeSent: {
    type: Date,
    default: Date.now()
  },
  lastMessage: {
    type: String
  },
  contactId: {
    type: String,
    required: true
  }
});

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = {chatModel, chatSchema };
