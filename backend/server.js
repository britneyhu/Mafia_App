const express = require('express');
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" }
});


const PORT = 5000;

app.get("/", (req, res)=>{
    res.send("Server is running");
})

function generateCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

io.on("connection", (socket) =>{
    console.log("A user connected:", socket.id);

    socket.on("createRoom", (name) => {
        socket.playerName = name;
        const roomCode = generateCode();

        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);

        console.log(`${socket.playerName} created a room: ${roomCode}`);
    })

    socket.on("joinRoom", ({name, roomCode})=>{
        const room = io.sockets.adapter.rooms.get(roomCode);

        if(room){
            socket.playerName = name;
            socket.join(roomCode);
            socket.emit("roomJoined", roomCode);

            console.log(`${socket.playerName} joined room: ${roomCode}`);
        }
        else{
            socket.emit("errorMessage", "Room Not Found");

            console.log(`Room not found: ${roomCode}`);
        }
    })
})

server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
