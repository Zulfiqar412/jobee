const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    default: Date.now()
  },
  isSeen: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    required: true
  }
});

const notificationModel = mongoose.model("notification", notificationSchema);
module.exports = notificationModel;
