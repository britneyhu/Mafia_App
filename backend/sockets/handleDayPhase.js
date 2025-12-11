const { setReady, getPlayers, getAlivePlayers, resetReady } = require("../rooms");

const roomTimers = {};

function handleDayPhase(socket, io) {
    socket.on("dayPhase", (roomCode, duration)=> {
        const alivePlayers = getAlivePlayers(roomCode);
        socket.emit("alivePlayers", alivePlayers.length);
        if(roomTimers[roomCode]) {
            clearInterval(roomTimers[roomCode]);
        }

        let timeLeft = duration;

        const interval = setInterval(()=> {
            io.to(roomCode).emit("dayTimer", timeLeft);
            timeLeft--;

            if(timeLeft === 0){

                clearInterval(interval);
                delete roomTimers[roomCode];

                io.to(roomCode).emit("allReady", "votePhase");
            }
        }, 1000);

        roomTimers[roomCode] = interval;
    });

    socket.on("skipDay", (roomCode)=> {
        const playersReady = setReady(roomCode, socket.id);
        const alivePlayers = getAlivePlayers(roomCode);
        const players = getPlayers(roomCode);
        const playerObject = players.find(p => p.id === socket.id);
        if(playerObject.ready) throw new Error(`Player Skipped Already`);

        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === alivePlayers.length){
            if(roomTimers[roomCode]){
                clearInterval(roomTimers[roomCode]);
                delete roomTimers[roomCode];
            }
            
            io.to(roomCode).emit("allReady", "votePhase");
            resetReady(roomCode);
        }
    });
}

module.exports = handleDayPhase;