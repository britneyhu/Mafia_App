const { resetRoom, assignRoles, getAlivePlayers } = require("../rooms");

function handleEndPhase(socket, io) {
    socket.on("restartGame", (roomCode)=> {
        resetRoom(roomCode);
        assignRoles(roomCode);

        const alivePlayers = getAlivePlayers(roomCode);

        io.to(roomCode).emit("gameRestarted");
        io.to(roomCode).emit("alivePlayers", alivePlayers.length);
    })
}

module.exports = handleEndPhase;