const handleCreateRoom = require("./handleCreateRoom");
const handleJoinRoom = require("./handleJoinRoom");
const handleRequestPlayers = require("./handleRequestPlayers");

function setupSocket(io) {
    io.on("connection", (socket) =>{
        console.log("A user connected:", socket.id);

        handleCreateRoom(socket, io);
        handleJoinRoom(socket, io);
        handleRequestPlayers(socket, io);
    });
}

module.exports = setupSocket;