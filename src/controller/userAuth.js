// const User = require('../models/userModel');
const User = require('../models/user')
const validate = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userMiddleware = require('../middleware/userMiddleware');
const redisClient = require('../config/redis');

const register = async (req, res) => {
  try {
    validate(req.body);

    const { firstname, lastname, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.role = 'user'

    // Save user to MongoDB
    const user = await User.create({
      firstname,
      lastname,
      emailId,
      password: hashedPassword,
    });

    // Generate token using the newly created user's ID
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role:'user' },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user._id,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId,role:user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        message: "Token not found. Please log in."
      });
    }

    const payload = jwt.decode(token);

    if (!payload || typeof payload.exp !== "number") {
      return res.status(401).json({
        message: "Invalid token or expiration missing"
      });
    }

    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

    if (expiresIn > 0) {
      await redisClient.set(`token:${token}`, "blocked", {
        EX: expiresIn
      });
    }

    res.clearCookie("token");

    return res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (err) {
    console.error("Logout error:", err);

    return res.status(500).json({
      message: "Logout failed",
      error: err.message
    });
  }
};

const adminRegister = async (req, res) => {
  try {
    validate(req.body);

    const { firstname, lastname, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    // Save user to MongoDB
    const user = await User.create({
      firstname,
      lastname,
      emailId,
      password: hashedPassword,
      role: 'admin',
    });

    // Generate token using the newly created user's ID
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
      userId: user._id,
    });
  } catch (err) {
    return res.status(400).json({
      message: "Error",
      error: err.message,
    });
  }
};


module.exports = {register,login,logout,adminRegister};
