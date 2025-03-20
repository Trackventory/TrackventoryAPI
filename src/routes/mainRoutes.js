const userRouter = require('./userRoutes');
const productRouter = require('./src/routes/productRoutes');
const express = require('express');

const router = express.Router();

router.use('/users', userRouter);
router.use('/products', productRouter);

module.exports = router;