const mongoose = require("mongoose");
require('dotenv').config()
const connectDB=()=>{
  return  mongoose.connect(process.env.DB).then((value)=>{
        console.log("Connected Successfully");
    }).then((err)=>{
        console.log(err);
    })
}


module.exports = connectDB;