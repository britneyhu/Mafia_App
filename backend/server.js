const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const setupSocket = require("./sockets/setupSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "https://playmaifa.netlify.app/" }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "https://playmaifa.netlify.app/",
    methods: ["GET", "POST"]
}));

app.get("/", (req, res)=>{
    res.send("Server is running");
})

setupSocket(io);

server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
