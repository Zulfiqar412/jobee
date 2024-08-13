const { chatModel } = require("../model/contact_model");
const userModel = require("../model/user_model");
class ChatController {
  addChat = async (req, res) => {
    const { profilePic, timeSent, name, provider, lastMessage, contactId } =
      req.body;

    try {
      let existingContact = await userModel.findOne({
        $or: [
          {
            _id: contactId,
            [`${provider}.contact`]: { $elemMatch: { contactId: contactId } }
          }
        ]
      });

      if (existingContact) {
        return res.json({ existingContact });
      }

      let contactDetail = chatModel({
        profilePic,
        timeSent,
        name,
        lastMessage,
        contactId
      });

      let newContact = await userModel.findByIdAndUpdate(
        contactId,
        {
          $push: {
            [`${provider}.contact`]: contactDetail
          }
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ newContact });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  getAllChat = async (req, res) => {
    try {
      const userId = req.params.id;
      const provider = req.params.provider;

      // Check if the provider is valid
      const validProviders = [
        "local",
        "google",
        "github",
        "twitter",
        "facebook"
      ];
      if (!validProviders.includes(provider)) {
        return res.status(400).send({ error: "Invalid provider" });
      }

      // Fetch the user document with only the contact field for the specified provider
      const user = await userModel.findOne(
        { _id: userId },

        { [`${provider}.contact`]: 1 }
      );

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const contacts = user[provider].contact;
      res.status(200).send(contacts);
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };
}

module.exports = new ChatController();
