const authRouter = require('./authRoutes');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const transactionRouter = require('./transactionRoutes');

const express = require('express');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
router.use('/transactions', transactionRouter);

module.exports = router;