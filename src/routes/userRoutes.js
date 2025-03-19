const express = require('express');
const { signUserUp, signUserIn } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', signUserUp);
userRouter.post('/signin', signUserIn);

module.exports = userRouter;