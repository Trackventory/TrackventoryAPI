const express = require('express');
const {
    signUserUp,
    signUserIn,
    changePassword 
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const authRouter = express.Router();

authRouter.post('/signup', signUserUp);
authRouter.post('/signin', signUserIn);

// All active users can change their password
authRouter.post('/change-password', authMiddleware, changePassword);

module.exports = authRouter;