
const jwt = require("jsonwebtoken");
const UserActivation = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    // Extract the JWT string from the cookie
    const token = req.cookies?.token;

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        message: "Token not found. Please log in."
      });
    }

    // Verify the JWT
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    const { _id } = payload;

    if (!_id) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    // Find the user
    const result = await UserActivation.findById(_id);

    if (!result) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Check Redis blocklist
    const isBlocked = await redisClient.exists(`token:${token}`);

    if (isBlocked) {
      return res.status(401).json({
        message: "Token is blocked"
      });
    }

    req.result = result;
    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }

    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = userMiddleware;
