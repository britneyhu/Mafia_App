const { getPlayers, getAlivePlayers, setDayPhaseReady, resetDayPhaseReady } = require("../rooms");

const roomTimers = {};

function handleDayPhase(socket, io) {
    //When day phase starts, send alive players, start timer
    socket.on("dayPhase", (roomCode, duration)=> {
        const alivePlayers = getAlivePlayers(roomCode);
        io.to(roomCode).emit("alivePlayers", alivePlayers.length);

        if(roomTimers[roomCode]) {
            clearInterval(roomTimers[roomCode]);
        }

        let timeLeft = duration+1;

        const interval = setInterval(()=> {
            io.to(roomCode).emit("dayTimer", timeLeft-1);
            timeLeft--;

            if(timeLeft === 0){

                clearInterval(interval);
                delete roomTimers[roomCode];

                io.to(roomCode).emit("dayPhaseAllReady", "votePhase");
            }
        }, 1000);

        roomTimers[roomCode] = interval;
    });

    //When a player presses skip, set them as ready, then update everyone on who is ready
    //If everyone is ready, clear timer, reset readys and emit vote phase
    socket.on("skipDay", (roomCode)=> {
        try{
            //Check if player pressed skip already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.dayPhaseReady) throw new Error(`Player skipped already`);

            const playersReady = setDayPhaseReady(roomCode, socket.id);
            io.to(roomCode).emit("dayPhaseReadyStatus", playersReady);

            const alivePlayers = getAlivePlayers(roomCode);

            if(playersReady.length === alivePlayers.length){
                if(roomTimers[roomCode]){
                    clearInterval(roomTimers[roomCode]);
                    delete roomTimers[roomCode];
                }
                
                io.to(roomCode).emit("dayPhaseAllReady", "votePhase");
                resetDayPhaseReady(roomCode);
            }
        }
        catch(err){
            socket.emit("errorMessage", err.message);
            setTimeout(()=> {
                socket.emit("errorMessage", "");
            }, 3000);

            console.error(err);
        }
    });
}

module.exports = handleDayPhase;