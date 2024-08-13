const mongoose = require("mongoose");

const applySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resume: { type: String, required: true },
  motivationLetter: {
    type: String,
    default: ""
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  applicationStatus: {
    type: String,
    required: true,
    enum: ["Application Sent", "Application Accepted", "Application Rejected"]
  },
  applyType: {
    type: String,
    enum: ["profile", "resume"],
    required: true
  }
});

const applyModel = mongoose.model("apply", applySchema);

module.exports = applyModel;
