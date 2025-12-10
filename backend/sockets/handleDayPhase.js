const { setReady, getPlayers, resetReady } = require("../rooms");

const roomTimers = {};

function handleDayPhase(socket, io) {
    socket.on("dayPhase", (roomCode, duration)=> {
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
        const totalPlayers = getPlayers(roomCode).length;

        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === totalPlayers){
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