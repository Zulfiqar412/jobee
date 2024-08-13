const express = require("express");
const User = require("../middleware/user");
const jobRouter = express.Router();
const jobController = require('../controller/book_mark_controller');


jobRouter.post("/add-to-bookmark/:JobId",User,jobController.addToBookMark);

jobRouter.delete("/delete-from-bookmark/:JobId/:userId",jobController.deleteFromBookMark);

jobRouter.get("/get-all-bookmark",User,jobController.getAllBookMark);


module.exports = jobRouter;