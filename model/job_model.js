const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  logo: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  recruiterId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salaryStartRange: {
    type: Number,
    required: true
  },
  salaryEndRange: {
    type: Number,
    required: true
  },
  jobPostDate: {
    type: Date,
    required: true
  },
  jobEndDate: {
    type: Date,
    required: true
  },
  workSite: {
    type: String,
    required: true
  },
  workMode: {
    type: String,
    required: true
  },
 
  desciption: [
    {
      type: String,
      required: true
    }
  ],
  qualification:[ {
    type: String,
    required: true
  }],
  perksBenefit: [
    {
      type: String,
      required: true
    }
  ],
  requiredSkils: [
    {
      type: String,
      required: true
    }
  ],
  jobSummary: {
    jobLevel: { type: String, required: true },
    jobCategory: { type: String, required: true },
    education: { type: String, required: true },
    experience: { type: String, required: true },
    vacancy: { type: Number, required: true }
  },
  websiteUrl: { type: String, required: true },
  about: {
    type: String,
    required: true
  }
});

const jobModel = mongoose.model("Job", jobSchema);

module.exports = { jobModel, jobSchema };
