const io = require("socket.io-client");

const socket = io("http://localhost:8000");

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket Server!");
});

socket.on("connect_error", (error) => {
    console.log("❌ Connection Error:", error);
});

socket.on("welcome", (message) => {
    console.log(message); // Should log "Welcome to the server!"
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});
