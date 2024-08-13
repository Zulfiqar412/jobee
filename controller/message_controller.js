let messageModel = require("../model/message_model");
let userModel = require("../model/user_model");
class MessageController {
  sendMessage = async (req, res) => {
    const {
      senderId,
      receiverId,
      provider,
      timeSent,
      messageType,
      isSeen,
      contactId,
      text,
      repliedMessage,
      repliedTo,
      repliedMessageType
    } = req.body;
    try {
      if (!senderId || !receiverId) {
        return res.status(400).json({ msg: "Invalid message data" });
      }
      let newMessage = messageModel({
        senderId,
        receiverId,

        timeSent,
        messageType,
        isSeen,
        text,
        contactId,
        repliedMessage,
        repliedTo,
        repliedMessageType
      });

      let message = await messageModel.create(newMessage);
      await userModel.updateOne(
        {
          _id: senderId,
          [`${provider}.contact`]: { $elemMatch: { contactId: senderId } }
        },
        {
          $set: {
            [`${provider}.contact.$.lastMessage`]: text,
            [`${provider}.contact.$.timeSent`]: timeSent
          }
        }
      );
      await userModel.updateOne(
        {
          _id: receiverId,
          [`${provider}.contact`]: { $elemMatch: { contactId: receiverId } }
        },
        {
          $set: {
            [`${provider}.contact.$.lastMessage`]: text,
            [`${provider}.contact.$.timeSent`]: timeSent
          }
        }
      );
      return res.status(200).json({ message });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };

  getAllMessages = async (req, res) => {
    try {
      const messagePerPage = 12;
      const currentPage = req.query.page || 1;
      const skipMessages = (currentPage - 1) * messagePerPage;

      let message = await messageModel
        .find({
          senderId: req.params.senderId,
          receiverId: req.params.receiverId,
          contactId: req.params.contactId
        })

        .sort({ timeSent: -1 })
        .skip(skipMessages)
        .limit(messagePerPage);
      return res.status(200).json({ message });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };
}
module.exports = new MessageController();
