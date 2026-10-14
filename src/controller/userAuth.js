const User = require('../models/userModel');
const validate = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
  try{
    //validate the data
    validate(req.body);

    const {firstname,lastname,emailId,password} = req.body;

    req.body.password = await bcrypt.hash(password,10);

    const token = jwt.sign({_id:User._id,emailId: emailId},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})

    res.cookie("token",token,{httpOnly:true,maxAge:3600000});
    res.status(201).json({message:"User registered successfully",token:token});


  }catch(err){
    res.status(400).json({mesage:"error",error:err.message});
  }
}

const login = async(req,res)=>{
  try{
    const {emailId,password} = req.body;
    if(!emailId || !password){
      return res.status(400).json({message:"Email and password are required"});

    }

    const user = User.findOne({emailId:emailId});

    //verify password
    const match = bcrypt.compare(password,user.password);
    if(!match){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const token = jwt.sign({_id:User._id,emailId: emailId},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
    res.cookie("token",token,{httpOnly:true,maxAge:3600000});
    res.status(200).json({message:"User logged in successfully",token:token});

  }catch(err)
  {
    res.status(400).json({message:"error",error:err.message});
  }
}

const logout = async(req,res)=>{
  try{
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});
  }catch(err){
    res.status(400).json({message:"error",error:err.message});
  }
}