const { setReady, getPlayers, resetReady } = require("../rooms");

function handlePlayersReady(socket, io) {
    socket.on("playerReady", (roomCode)=>{
        const playersReady = setReady(roomCode, socket.id);
        const totalPlayers = getPlayers(roomCode).length;

        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === totalPlayers){
            io.to(roomCode).emit("allReady", "day");
            resetReady(roomCode);
        }
    });
}

module.exports = handlePlayersReady;