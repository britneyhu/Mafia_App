const handleCreateRoom = require("./handleCreateRoom");
const handleJoinRoom = require("./handleJoinRoom");
const handleToolRequests = require("./handleToolRequests");
const handleStartGame = require("./handleStartGame");
const handleRolePhase = require("./handleRolePhase");
const handleDayPhase = require("./handleDayPhase");
const handleVotePhase = require("./handleVotePhase");
const handleNightPhase = require("./handleNightPhase");
const handleEndPhase = require("./handleEndPhase");

function setupSocket(io) {
    io.on("connection", (socket) =>{
        console.log("A user connected:", socket.id);

        handleCreateRoom(socket, io);
        handleJoinRoom(socket, io);
        handleToolRequests(socket, io);
        handleStartGame(socket, io);
        handleRolePhase(socket, io);
        handleDayPhase(socket, io);
        handleVotePhase(socket, io);
        handleNightPhase(socket, io);
        handleEndPhase(socket, io);
    });
}

module.exports = setupSocket;