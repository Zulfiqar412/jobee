let admin = require("../helper/firebase");
const userModel = require("../model/user_model");
const notificationModel = require("../model/notification_model");

let sendPushNotification = async (token, payload, data) => {
  let option = {
    priority: "normal",
    timeToLive: 60 * 60
  };
  return await admin
    .messaging()
    .sendToDevice(token, payload, option)
    .then(async function (response) {
      let notification = notificationModel({
        title: payload.notification.title,
        body: payload.notification.message,
        dateTime: Date.now(),
        type: data.type
      });

      notification = await notification.save();
      console.log("notification is sent to all");
      return { message: response };
    })
    .catch((e) => {
      console.log(token);
      console.log("error is " + e);
      reject({ error: e });
    });
};

let send_notification_to_specific = async (req, res) => {
  const Ids = req.body.Ids;
  const title = req.body.title;
  const message = req.body.message;
  const data = req.body.data;
  const provider = req.body.data.provider;
  if (
    Ids === undefined ||
    title === undefined ||
    title === "" ||
    message === undefined ||
    message === "" ||
    data === undefined
  ) {
    return res.status(400).json({ msg: "Please give information" });
  }

  let payload = {
    notification: {
      title: title,
      message: message
    },
    data: data
  };

  await userModel
    .find({ _id: { $in: Ids } })

    .then((user) => {
      let tokens = user.map((user) => user[provider].deviceToken);

      if (tokens.length > 0) {
        sendPushNotification(tokens, payload, data)
          .then((jsonOb) => {
            res.status(200).json({ jsonOb });
          })
          .catch((error) => {
            res.status(500).json({ msg: error.message });
          });
      } else {
        res.status(400).json({ msg: "No valid Ids" });
      }
    })
    .catch((e) => {
      res.status(500).json({ msg: e.message });
    });
};

const sendOneToOneNotificationToSpecificUser = async (req, res) => {
  try {
    console.log("notification");
    const message = {
      token: req.params.token,
      notification: {
        title: req.body.title,
        body: req.body.body
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
          color: "#f45342"
        }
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: "default"
          }
        },
        headers: {
          // Additional iOS-specific options can be added here
          "apns-priority": "10"
        }
      }
    };
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("notification is send");
      })
      .catch((e) => {
        console.log("Error is " + e);
      });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  send_notification_to_specific,
  sendOneToOneNotificationToSpecificUser
};
