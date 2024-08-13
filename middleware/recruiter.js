const jwt = require("jsonwebtoken");
const userModel = require("../model/user_model");
const recruiter = async (req, res,next) => {

  const token = req.header("x-auth-token");
  const provider = req.header("provider")
  console.log("token");
  if (!token) {
    return res.status(400).json({ msg: "Token not found" });
  }

  const isVerified =  jwt.verify(token, "passwordkey");
  if (!isVerified) {
    return res.status(400).json({ msg: "Token is invalid. Accessed denied" });
  }
  let user = await userModel.findById({ _id: isVerified });
    console.log("user is "+user);
  if (user[provider].role === "employee") {
    return res.status(400).json({ msg: "Your are not recruiter" });
  }
  req.user = isVerified;
  req.token = token;
  next();
};

module.exports = recruiter;