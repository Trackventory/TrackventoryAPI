// const express = require('express');
// const connectToDB = require('./src/config/db');
// const mainRouter = require('./src/routes/mainRoutes');
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger/swagger.yml');
// const http = require('http'); // Import http module
// const { Server } = require('socket.io'); // Import socket.io



// require('dotenv/config');



// const PORT = process.env.PORT || 8000;

// const app = express();
// const server = http.createServer(app); // Create an HTTP server
// const io = new Server(server, {
//     cors: {
//         origin: "*", // Allow all origins, meaning any domain can connect
//         methods: ["GET", "POST"]
//     }
// }); 



// connectToDB();

// app.use(express.json());
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// // Socket.IO logic
// io.on("connection", (socket) => {
//     console.log(`⚡ A user connected: ${socket.id}`);

//     // Handle disconnection
//     socket.on("disconnect", () => {
//         console.log(`❌ User disconnected: ${socket.id}`);
//     });
// });

// module.exports = io; // Export the io instance for use in other modules

// app.get("/", (req, res) => {
//     res.send("Welcome to Trackventory API!");
// });

// app.use('/api/v1/trackventory', mainRouter);

// // Create a route for socket.io
// app.get('/socket.io/*', (req, res) => {
//     res.sendStatus(404); // Explicitly handle the /socket.io route
// });

// app.listen(PORT, () => {
//     console.log(`Server is running at: localhost:${PORT}/api/v1/trackventory`);
// });

const express = require('express');
const connectToDB = require('./src/config/db');
const mainRouter = require('./src/routes/mainRoutes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yml');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import socket.io

require('dotenv/config');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins, meaning any domain can connect
        methods: ["GET", "POST"]
    }
});

connectToDB();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Socket.IO logic
io.on("connection", (socket) => {
    console.log(`⚡ A user connected: ${socket.id}`);
    socket.emit("welcome", "Welcome to the server!"); // Send a message to the client

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

app.get("/", (req, res) => {
    res.send("Welcome to Trackventory API!");
});

app.use('/api/v1/trackventory', mainRouter);

server.listen(PORT, () => {
    console.log(`Server is running at: localhost:${PORT}/api/v1/trackventory`);
});
