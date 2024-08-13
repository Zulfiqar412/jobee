const userModel = require("../model/user_model");
class ProfileController {
  updateProfile = async (req, res) => {
    try {
      const { name, jobPosition } = req.body;
      const userId = req.params.userId;
      await userModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { name: name, jobPositions } }
      );
      return res.status(200).json({ msg: "Profile updated successfully" });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };
  saveContactInformation = async (req, res) => {
    try {
      const { address, number, email, provider } = req.body;
      const userId = req.params.userId;
      await userModel.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            [`${provider}.address`]: address,
            [`${provider}.number`]: number,
            [`${provider}.email`]: email
          }
        }
      );
      return res.status(200).json({ msg: "Profile updated successfully" });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };
  saveSummary = async (req, res) => {
    try {
      const { summary, provider } = req.body;
      const userId = req.params.userId;

      await userModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { [`${provider}.summary`]: summary } }
      );
      return res.status(200).json({ msg: "Profile updated successfully" });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  
}
