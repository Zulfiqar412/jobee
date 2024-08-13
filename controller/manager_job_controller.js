const { jobModel } = require("../model/job_model");

const applicationModel = require("../model/application_model");
const postNewJob = async (req, res) => {
  console.log("request");
  try {
    const {
      logo,
      title,
      company,
      location,
      salaryStartRange,
      salaryEndRange,
      jobPostDate,
      jobEndDate,
      workSite,
      workMode,
      desciption,
      recruiterId,
      qualification,
      perksBenefit,
      requiredSkils,
      jobSummary,
      websiteUrl,
      about
    } = req.body;

    let jobPost = new jobModel({
      logo,
      title,
      company,
      location,
      salaryStartRange,
      salaryEndRange,
      jobPostDate,
      jobEndDate,
      workSite,
      recruiterId,
      workMode,
      desciption,
      qualification,
      perksBenefit,
      requiredSkils,
      jobSummary,
      websiteUrl,
      about
    });
    jobPost = await jobPost.save();
    return res
      .status(200)
      .json({ msg: "Job posted successfully", job: jobPost });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

const getAllJob = async (req, res) => {
  try {
    let jobs = await jobModel.find({});
    return res.status(200).json(jobs);
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

const getAllManagerJob = async (req, res) => {
  try {
    let jobs = await jobModel.find({ recruiterId: req.user });
    return res.status(200).json({ jobs });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

updateApplicationStatus = async (req, res) => {
  console.log("request");
  try {
    const { status, applicationId } = req.body;
    let application = await applicationModel.findByIdAndUpdate(
      { _id: applicationId },
      { $set: { applicationStatus: status } },
      { upsert: true, new: true }
    );
    return res.status(200).json({ application });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};
module.exports = {
  postNewJob,
  getAllJob,
  getAllManagerJob,
  updateApplicationStatus
};
