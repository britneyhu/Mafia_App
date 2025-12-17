const { resetRoom, assignRoles, getPlayers } = require("../rooms");
const { dayPhaseTimers } = require("./handleDayPhase");
const { nightPhaseTimers } = require("./handleNightPhase");
const { votePhaseTimers, voteResultsPhaseTimers } = require("./handleVotePhase");

function handleEndPhase(socket, io) {
    socket.on("restartGame", (roomCode)=> {
        resetRoom(roomCode);
        assignRoles(roomCode);
        if (dayPhaseTimers[roomCode]) {
            clearInterval(dayPhaseTimers[roomCode]);
            delete dayPhaseTimers[roomCode];
        }
        if (nightPhaseTimers[roomCode]) {
            clearInterval(nightPhaseTimers[roomCode]);
            delete nightPhaseTimers[roomCode];
        }
        if (votePhaseTimers[roomCode]) {
            clearInterval(votePhaseTimers[roomCode]);
            delete votePhaseTimers[roomCode];
        }
        if (voteResultsPhaseTimers[roomCode]) {
            clearInterval(voteResultsPhaseTimers[roomCode]);
            delete voteResultsPhaseTimers[roomCode];
        }

        const players = getPlayers(roomCode);

        io.to(roomCode).emit("gameRestarted");
        io.to(roomCode).emit("alivePlayers", players.length);
    })
}

module.exports = handleEndPhase;