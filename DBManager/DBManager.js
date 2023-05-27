const User = require("../models/User");

const check = (req, res, next) => {
  res.json("Connection Established");
  console.log("Connection Established");
};

const index = (req, res, next) => {
  User
    .find()
    .then((response) => {
      res.json({response});
    })
    .catch((error) => {
      res.json({message: "Error :"+error});
    });
};

const show = (req, res, next) => {
  let userId = req.body.userId;
  console.log("Request By user To Show Data :",req.body.userId);
  User.findById(userId)
    .then((response) => {
      res.json({response});
    })
    .catch((error) => {
      res.json({message: "Error :"+error});
    });
};

const register = (req, res, next) => {
  console.log("DATA RECEIVE", req.body);
  let data = new User({
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    pass: req.body.pass,
  });
  data.save()
    .then((response) => {
      res.json({
        status:200,
        message:"Registration Successful",
      })
    })
    .catch((error) => {
      res.json({message: "Error :"+error});
    });
};

const update = (req, res, next) => {
  let emailId = req.body.email;
  let data = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    pass: req.body.pass,
  };
  User.findOneAndUpdate({'email':emailId}, {$set: data},{returnOriginal:false})
    .then(() => {
      res.json({message: "User Update Successful"});
    })
    .catch((error) => {
      res.json({message: "Error :"+error}); 
    });
};

const find = (req,res,next)=>{
  let emailId = req.body.email;
  User.findOne({email:emailId})
  .then((response)=>{res.json({message:response || "No User Found"})}).catch((err)=>{res.json({message:err})});
}
const remove = (req,res,next)=>{
  let userId = req.body.userId;
  User.findByIdAndRemove(userId)
  .then(()=>{res.json({message:"User Delete Successfully"})})
  .catch((error)=>{res.json({message:"Error :"+error})})
}

const login = (req,res,next)=>{
  let emailId = req.body.email;
  let pass = req.body.pass;
  
  User.findOne({email:emailId})
  .then((response)=>{
    if(response.pass === pass){
      res.json({
        status:200,
        message:"Login Successful",
      })
    }
    else{
      res.json({
        status:201,
        message:"Password Incorrect",
      })
    }

  })
  .catch(()=>{
    res.json({message:{
      message:"Login Failed",
      status:200,
    }})
  })
}
module.exports = {
  index,
  show,
  register,
  check,
  update,
  remove,
find,
login,
};
