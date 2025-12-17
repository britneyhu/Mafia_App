const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const setupSocket = require("./sockets/setupSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res)=>{
    res.send("Server is running");
})

setupSocket(io);

server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
