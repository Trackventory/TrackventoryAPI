const rateLimit = require('express-rate-limit');

exports.createRateLimiter = (maxRequests, windowMinutes, message = 'Too many requests. Please try again later.') => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,  
        max: maxRequests,                     
        handler: (req, res) => {
            console.warn(`Rate limit exceeded for IP: ${req.ip} - Path: ${req.originalUrl}`);
            res.status(429).json({
                status: 'error',
                message: 'Calm down, boss! Too many requests. Try again in 15 minutes.',
                retryAfter: '15 minutes',
                supportContact: 'support@gmail.com'
            });
        }
    });
};