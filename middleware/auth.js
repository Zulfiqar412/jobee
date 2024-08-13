const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.headers("x-auth-token");
    if (!token) {
      return res.status(400).json({ msg: "Token not found" });
    }

    const isVerified = await jwt.verify(token, "passwordkey");
    if (!isVerified) {
      return res.status(400).json({ msg: "Invalid token. Accessed denied" });
    }

    req.user = isVerified.id;
    req.token = token;
    next();
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

module.exports = auth;
