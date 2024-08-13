const express = require("express");
const { providers, passportfun } = require("../passport");
const userModel = require("../model/user_model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { genrateOtp, sendOtp } = require("../helper/utils");

const passport = passportfun();
const router = express.Router();
require("dotenv").config();

router.get("/auth/:provider", (req, res, next) => {
  const provider = req.params.provider;

  passport.authenticate(provider, providers[provider].options)(req, res, next);
});

router.get("/auth/:provider/callback", (req, res, next) => {
  const provider = req.params.provider;

  passport.authenticate(
    provider,
    { failureRedirect: "/login" },
    async (err, user) => {
      if (err) {
        res.send("Error is " + err);
      }
      if (!user) {
        res.send("No user");
      }
      if (user) {
        res.send(user);
      }
    }
  )(req, res, next);
});

// sign-up user email and password
router.post("/api-sign-up-user", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email not found" });
    }
    if (!password) {
      return res.status(400).json({ msg: "Password not found" });
    }

    let user = await userModel.findOne({ "local.email": email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User with that email already exists" });
    }

    const hashedpassword = await bcryptjs.hash(password, 8);
    console.log(hashedpassword);
    let newUser = new userModel({
      local: {
        email,
        password: hashedpassword
      }
    });

    console.log(newUser);
    newUser = await newUser.save();
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error("Error:", e);
    if (e.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(400).json({ msg: "Duplicate key error" });
    }
    return res.status(500).json({ msg: e.message });
  }
});

//login user with email and password

router.post("/api-login-user", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ "local.email": email });

    if (!user) {
      return res.status(400).json({ msg: "User with that email not found" });
    }
    const comparedpassword = await bcryptjs.compare(
      password,
      user.local.password
    );
    if (!comparedpassword) {
      return res.status(400).json({ msg: "password is invalid" });
    }

    const token = jwt.sign(user.id, "passwordkey");
    return res.status(200).json({ token, ...user._doc });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});

// forgot password
router.get("/api-forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    let user = await userModel.findOne({ "local.email": email });

    if (!user) {
      return res.status(200).json({ msg: "User not found" });
    }

    const randomtoken = crypto.randomBytes(20).toString("hex");
    let updateUser = await userModel.findOneAndUpdate(
      { "local.email": email },
      { $set: { "local.token": randomtoken } },
      { new: true }
    );
    console.log(updateUser);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `<p>Hi</p> ${updateUser.name} please click the link <a href =http://localhost:3000/api-password-reset?token=${randomtoken}>${randomtoken} </a>`
    };
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent " + info.response);
      }
    });
    return res.status(200).json({ msg: "Mail has benn sent to your gmail" });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});

router.get("/api-password-reset", async (req, res) => {
  try {
    const token = req.query.token;
    let user = userModel.findOne({ "local.token": token });
    if (user) {
      res.send(
        `
        <h3>Reset Password</h3>
      <form id="reset-password" action="/reset-password">
        <input type="password" required name="password" id="password">
        <input type="submit" name="reset" id="Reset" value="Reset">
      </form>
      <script>
        document.getElementById("reset-password").addEventListener('submit', function(event) {
          event.preventDefault();

          const password = document.getElementById('password').value;
          let value = new URLSearchParams(window.location.search).get("token");
          fetch(this.action, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password, token: value })
          }).then((response) => response.json()).then(data => {
            if (data.success) {
              alert('Password reset successfully!');
            } else {
              res.send('Error resetting password: ' + data.message);
            }
          }).catch(e => {
            alert('Error: ' + e.message);
          });
        });
      </script>
      `
      );
    } else {
      res.status(400).json({ msg: "This token is expired" });
    }
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log(req.body);

    const securedpassword = await bcryptjs.hash(password, 8);
    console.log(securedpassword);

    let userData = await userModel.findOneAndUpdate(
      { "local.token": token },
      { $set: { "local.password": securedpassword, "local.token": "" } },
      { new: true } // This option returns the updated document
    );
    console.log(userData);
    if (userData) {
      return res.json({
        success: true,
        message: "Password reset successfully",
        user: userData
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/api-verify-phone-number/:userId", async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = genrateOtp();
  const otpExpire = Date.now() * 600000;
  try {
    let userData = userModel.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: { number: phoneNumber, otpExpire: otpExpire } },
      { upsert: true, new: true }
    );

    await sendOtp(otp, number);

    return res.status(200).json({
      verify: true,
      msg: "OTP verified successfully",
      ...userData.doc
    });
  } catch (e) {}
});

// profile set up api
router.post("/api-profile/:userId/:provider", async (req, res) => {
  console.log("reques");

  console.log(req.params.userId);
  console.log(req.params.provider);
  const provider = req.params.provider;
  try {
    const {
      country,
      role,
      expertise,
      name,
      nickName,
      image,
      dateofbirth,
      phoneNumber,
      gender
    } = req.body;

    let userData = {};

    (userData[`${provider}.country`] = country),
      (userData[`${provider}.role`] = role);
    userData[`${provider}.expertise`] = expertise;
    userData[`${provider}.image`] = image;
    userData[`${provider}.nickName`] = nickName;
    userData[`${provider}.name`] = name;
    userData[`${provider}.dateOfBirth`] = dateofbirth;
    userData[`${provider}.number`] = phoneNumber;
    userData[`${provider}.gender`] = gender;
    console.log(`after user data is ${JSON.stringify(userData)}`);
    let user = await userModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: userData
      },
      { new: true }
    );
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});

router.get("/login", (req, res) => {
  res.send("Loggin error");
});

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.send("Error logging out: " + err);
    }
    res.redirect("/login"); // Redirect to the login page or homepage after logout
  });
});

module.exports = router;
