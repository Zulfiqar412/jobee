const express = require("express");
const applicationController = require("../controller/user_controller");
const applicationRouter = express.Router();

applicationRouter.post("/apply-for-job", applicationController.applyForJob);
applicationRouter.get(
  "/get-user-application/:userId",
  applicationController.userApplication
);


module.exports = applicationRouter;
