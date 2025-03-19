const express = require('express');
const connectToDB = require('./src/config/db');
const mainRouter = require('./src/routes/mainRoutes');
const productRouter = require('./src/routes/productRoutes');
require('dotenv/config');

const PORT = process.env.PORT || 8000;

const app = express();

connectToDB();

app.use(express.json());

app.use('/api/v1/trackventory', mainRouter);
app.use('/api/v1/trackventory', productRouter);

app.listen(PORT, () => {
    console.log(`Server is running at: localhost:${PORT}/api/v1/trackventory`);
});