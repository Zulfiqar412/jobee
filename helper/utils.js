const twilio = require("twilio");
require("dotenv").config();
const genrateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

const sendOtp = async (otp, number) => {
  const accountId = process.env.ACCOUNT_ID;
  const accountToken = process.env.ACCOUNT_TOKEN;
  const client = twilio(accountId, accountToken);
  try {
  await  client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.PHONE_NUMBER,
      to: number
    });
  } catch (e) {
    console.log("Otp error is "+e);
  }
};


module.exports={genrateOtp,sendOtp};