const mongoose = require("mongoose");
const { chatSchema } = require("../model/contact_model");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ""
    },
    nickName: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true
    },
    accountId: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: ""
    },
    dateOfBirth: {
      type: String
    },
    gender: {
      type: String
    },
    country: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["recruiter", "employee"]
    },
    expertise: [{ type: String }],
    provider: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      default: ""
    },
    deviceToken: {
      type: String,
      default: ""
    },
    jobPosition: {
      type: String,
      default: ""
    },
    summary: { type: String },
    token: {
      type: String,
      default: ""
    },
    number: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    otpExpire: {
      type: Date
    },
    userId: {
      type: String,
      required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    contact: [chatSchema]
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  local: {
    name: {
      type: String,
      default: ""
    },
    nickName: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },
    jobPosition: {
      type: String,
      default: ""
    },
    userId: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    dateOfBirth: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      default: ""
    },
    country: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["recruiter", "employee"]
    },
    address: {
      type: String,
      default: ""
    },
    summary: { type: String },
    expertise: [{ type: String }],
    token: {
      type: String,
      default: ""
    },
    number: {
      type: String,
      default: ""
    },
    otpExpire: {
      type: Date
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    deviceToken: {
      type: String,
      default: ""
    },
    contact: [chatSchema]
  },
  google: {
    type: providerSchema,
    required: false
  },
  github: {
    type: providerSchema,
    required: false
  },
  twitter: {
    type: providerSchema,
    required: false
  },
  facebook: {
    type: providerSchema,
    required: false
  }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
