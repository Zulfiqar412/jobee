const express = require("express");
const jobController = require("../controller/job_controller");
const jobRouter = express.Router();

jobRouter.get("/search-job", jobController.searchJob);
jobRouter.get("/get-recent-job", jobController.recentJob);
jobRouter.get("/filter-job", jobController.filterJob);
jobRouter.get("/sort-job", jobController.sortedJobs);

module.exports = jobRouter;
