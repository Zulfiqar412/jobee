const mongoose = require("mongoose");
const { jobSchema } = require("../model/job_model");
const bookMarkSchema = mongoose.Schema({
  job: {
    type: jobSchema,

    required: true
  },
  jobId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Job"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});
const bookMarkModel = mongoose.model("BookMark", bookMarkSchema);
module.exports = { bookMarkSchema, bookMarkModel };
