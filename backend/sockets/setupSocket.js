const handleCreateRoom = require("./handleCreateRoom");
const handleJoinRoom = require("./handleJoinRoom");
const handleRequestPlayers = require("./handleRequestPlayers");
const handleStartGame = require("./handleStartGame");
const handleRoleReveal = require("./handleRoleReveal");
const handlePlayersReady = require("./handlePlayersReady");

function setupSocket(io) {
    io.on("connection", (socket) =>{
        console.log("A user connected:", socket.id);

        handleCreateRoom(socket, io);
        handleJoinRoom(socket, io);
        handleRequestPlayers(socket, io);
        handleStartGame(socket, io);
        handleRoleReveal(socket, io);
        handlePlayersReady(socket, io);
    });
}

module.exports = setupSocket;