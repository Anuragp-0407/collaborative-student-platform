const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const setupChatSocket = require("./src/socket/chatSocket");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Setup Socket.IO chat functionality
setupChatSocket(io);

// Connect to MongoDB
connectDB();

// Start HTTP + Socket.IO server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});