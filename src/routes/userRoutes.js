const express = require('express');
const {
    signUserUp,
    signUserIn,
    changePassword 
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const userRouter = express.Router();

userRouter.post('/signup', signUserUp);
userRouter.post('/signin', signUserIn);
userRouter.post('/change-password', authMiddleware, changePassword);

module.exports = userRouter;