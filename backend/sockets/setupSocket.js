const handleCreateRoom = require("./handleCreateRoom");
const handleJoinRoom = require("./handleJoinRoom");
const handleRequestPlayers = require("./handleRequestPlayers");
const handleStartGame = require("./handleStartGame");
const handleRolePhase = require("./handleRolePhase");
const handleDayPhase = require("./handleDayPhase");

function setupSocket(io) {
    io.on("connection", (socket) =>{
        console.log("A user connected:", socket.id);

        handleCreateRoom(socket, io);
        handleJoinRoom(socket, io);
        handleRequestPlayers(socket, io);
        handleStartGame(socket, io);
        handleRolePhase(socket, io);
        handleDayPhase(socket, io);
    });
}

module.exports = setupSocket;