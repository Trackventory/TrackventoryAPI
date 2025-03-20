const User = require("../models/user");

const activeUserMiddleware = async (req, res, next) => {
  try {
    const userId = req.userInfo.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        status: false,
        message: "Access denied! Your account is disabled.",
      });
    }

    next();
  } catch (error) {
    console.error("🔥 Error checking active user:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while checking user status.",
    });
  }
};

module.exports = { activeUserMiddleware };
