const express = require('express');
const connectToDB = require('./src/config/db');
const mainRouter = require('./src/routes/mainRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yml');
const http = require('http');  // Required for creating HTTP server
const socketIo = require('socket.io');



require('dotenv/config');

const server = http.createServer(app);  // Create a new HTTP server

const io = socketIo(server);  // Create a new socket.io instance attached to the server

const PORT = process.env.PORT || 8000;

const app = express();



connectToDB();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Socket.IO logic

app.get("/", (req, res) => {
    res.send("Welcome to Trackventory API!");
});

app.use('/api/v1/trackventory', mainRouter);

app.listen(PORT, () => {
    console.log(`Server is running at: localhost:${PORT}/api/v1/trackventory`);
});