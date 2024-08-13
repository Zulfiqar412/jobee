const express = require("express");
const jobRouter = express.Router();
const recruiter = require("../middleware/recruiter");
const jobController = require("../controller/manager_job_controller");
jobRouter.post("/post-new-job", recruiter, jobController.postNewJob);
jobRouter.get("/get-all-job", jobController.getAllJob);
jobRouter.get(
  "/get-all-manager-job",
  recruiter,
  jobController.getAllManagerJob
);

jobRouter.post(
  "/update-application-status",
  jobController.updateApplicationStatus
);

module.exports = jobRouter;
