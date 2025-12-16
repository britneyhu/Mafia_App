const { resetRoom, assignRoles, getPlayers } = require("../rooms");

function handleEndPhase(socket, io) {
    socket.on("restartGame", (roomCode)=> {
        resetRoom(roomCode);
        assignRoles(roomCode);

        const players = getPlayers(roomCode);

        io.to(roomCode).emit("gameRestarted");
        io.to(roomCode).emit("alivePlayers", players.length);
    })
}

module.exports = handleEndPhase;