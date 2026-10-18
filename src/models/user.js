const mongoose = require('mongoose');

const userScehma = new mongoose.Schema({
  firstname:{
    type:String,
    required:true,
    minLength:3,
    maxLength:50
  },
  lastname:{
    type:String,
    required:true,
    minLength:3,
    maxLength:50
  },
  emailId:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    immutable:true,
  },
  age:{
    type:Number,
    min:6,
    max:90
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  },

  problemSolved:{
    type:[String],
    default:0
  },

  password:{
    type:String,
    required:true,
    minLength:8
  }

},{timestamps:true}); 

module.exports = mongoose.model("User",userScehma);