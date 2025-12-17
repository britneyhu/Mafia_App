const { getPlayers, assignRoles, getAlivePlayers } = require("../rooms");

function handleStartGame(socket, io) {
    socket.on("startGame", (roomCode)=>{
        try{
            const players = getPlayers(roomCode);
            if(players.length < 4) throw new Error("Need 4 players to start");
            assignRoles(roomCode); 
            io.to(roomCode).emit("gameStart");
            
        }
        catch(err){
            socket.emit("errorMessage", err.message);

            console.error(err);
        }
    });

    socket.on("requestAlivePlayers", (roomCode)=> {
        const alivePlayers = getAlivePlayers(roomCode);
        socket.emit("alivePlayers", alivePlayers.length);
    })
}

module.exports = handleStartGame;