const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const setupSocket = require("./sockets/setupSocket");

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "https://playmaifa.netlify.app", // Deployed frontend
];

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"]
}));

app.get("/", (req, res) => {
    res.send("Server is running");
});

setupSocket(io);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});