const applicationModel = require("../model/application_model");

class UserController {
  applyForJob = async(req, res) => {
    const {
      userId,
      jobId,
      name,
      email,
      resume,
      recruiterId,
      motivationLetter,
      applicationStatus,
      applyType
    } = req.body;

    try {
      let application = applicationModel({
        userId,
        jobId,
        name,
        email,
        recruiterId,
        resume,
        motivationLetter,
        applicationStatus,
        applyType
      });
      application = await application.save();
      return res.status(200).json({ application });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  userApplication = async (req, res) => {
    try {
      const userId = req.params.userId;
      let applications = await applicationModel
        .find({
          userId: userId
        })
        .populate("jobId");
      return res.status(200).json({ applications });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  
}


module.exports = new UserController();