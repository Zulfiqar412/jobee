const { bookMarkModel } = require("../model/book_mark_model");
 const {jobModel} = require('../model/job_model');
const addToBookMark = async (req, res) => {
    try {
      const jobId = req.params.JobId;
        let bookMark=await  bookMarkModel.findOne({jobId:jobId});
        if(bookMark){
          return res.json({"msg":"BookMark already exsisted"})
        }

      let job = await jobModel.findById({ _id: jobId });
      
      let newbookMark = bookMarkModel({
        job: job,
        jobId:jobId,
        userId: req.user
      });
      newbookMark = await newbookMark.save();
  
      return res
        .status(200)
        .json({ msg: "BookMark added successfully", newbookMark });
    } catch (e) {
      return res.status(500).json({ msg: e.message });
    }
  };
  

  const deleteFromBookMark=async(req,res)=>{
    console.log("call");
     try{
        const jobId = req.params.JobId;
        const userId=req.params.userId;
      await  bookMarkModel.findOneAndDelete({"job.jobId":jobId,userId:userId})
      return res.status(200).json({msg:"Deleted form BookMark successfully"});

     }catch(e){
        console.log(e);
        return res.status(500).json({msg:e.message})
     }
  }


  const getAllBookMark=async(req,res)=>{
    try{
      let bookMark = await bookMarkModel.find({userId:req.user});
      return res.status(200).json({bookMark});
    }catch(e){
      return res.status(500).json({msg:e.message})
    }
  }

  module.exports={
    addToBookMark,
    deleteFromBookMark,
    getAllBookMark
  }