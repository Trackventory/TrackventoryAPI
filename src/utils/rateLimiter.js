const rateLimit = require('express-rate-limit');

exports.createRateLimiter = (maxRequests, windowMinutes, message = 'Too many requests. Please try again later.') => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,  // Time window in milliseconds
        max: maxRequests,                     // Maximum number of requests allowed in the time window
        handler: (req, res) => {
            console.warn(`Rate limit exceeded for IP: ${req.ip} - Path: ${req.originalUrl}`);
            res.status(429).json({
                status: 'error',
                message: 'Too many requests. Please wait and try again later.',
                retryAfter: '15 minutes',
                supportContact: 'support@gmail.com'
            });
        }
    });
};
