const jwt = require('jsonwebtoken');
require('dotenv/config');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Login to continue'
        });
    }

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedTokenInfo;
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Access denied. No token provided. Login to continue.',
            error: err.message
        });
    }
}

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
module.exports = { authMiddleware, roleMiddleware };