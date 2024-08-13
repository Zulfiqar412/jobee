let admin = require("firebase-admin");

let serviceAccount = require("../helper/serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
