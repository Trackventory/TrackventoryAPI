const express = require('express');
const connectToDB = require('./src/config/db');
const mainRouter = require('./src/routes/mainRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yml');
require('dotenv/config');

const PORT = process.env.PORT || 8000;

const app = express();

connectToDB();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("Welcome to Trackventory API!");
});

app.use('/api/v1/trackventory', mainRouter);

app.listen(PORT, () => {
    console.log(`Server is running at: localhost:${PORT}/api/v1/trackventory`);
});