const User = require("../models/user");

const roleMiddleware = (roles) => {
return async (req, res, next) => {
    try {
    const user = await User.findById(req.userInfo.id);
    if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
    } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
    }
};
};
module.exports = { roleMiddleware };