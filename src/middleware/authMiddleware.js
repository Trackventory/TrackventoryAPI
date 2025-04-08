const jwt = require('jsonwebtoken');
require('dotenv/config');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Case 1: Token not present
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Please login to continue'
        });
    }

    try {
        // Case 2: Token verification
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userInfo = decodedTokenInfo;
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.',
                error: err.message
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.',
                error: err.message
            });
        }

        if (err.name === 'NotBeforeError') {
            return res.status(401).json({
                success: false,
                message: 'Token not active. Please try again later.',
                error: err.message
            });
        }
        
        // Case 3: Unknown or unexpected error
        return res.status(500).json({
            success: false,
            message: 'Internal server error during token verification.',
            error: err.message
        });
    }
};

module.exports = { authMiddleware };