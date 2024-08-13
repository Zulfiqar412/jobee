const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./helper/db_config");
require("dotenv").config();
const authRoute = require("./controller/auth");
const managerJobRouter = require("./router/manager_job_routes");
const bookMarkRouter = require("./router/book_mark_routes");
const jobRouter = require("./router/job_routes");
const notificationRouter = require("./router/notification_router");
const messageRouter = require("./router/message_router");
const chatRouter = require("./router/chat_router");
const userRouter = require("./router/user_router");
const port = process.env.PORT;
const app = express();
const { passportfun } = require("./passport");

const passport = passportfun();
const session = require("express-session");

app.use(
  session({
    secret:
      "nsdvw3t244waugfdszvjmsgueyr7t34ru342ygyuj&#@&TEJHgajertq37te8yUY@#I*uhdfjdvzdnmdcvseutfaejyfgzajgiy2t37q264UtU", // Replace with your secret key
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening at port ${port}`);
    });
  })
  .catch((e) => {
    console.error("Failed to connect to the database. Server not started.", e);
  });
//app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.json());

app.use(authRoute);
app.use("/api/job", managerJobRouter);
app.use("/api/bookmark", bookMarkRouter);
app.use("/api", jobRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/message", messageRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);
