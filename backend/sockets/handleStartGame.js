const { getPlayers, assignRoles } = require("../rooms");

function handleStartGame(socket, io) {
    socket.on("startGame", (roomCode)=>{
        try{
            const players = getPlayers(roomCode);
            if(players.length < 4) throw new Error("Need 4 Players To Start");
            assignRoles(roomCode); 
            io.to(roomCode).emit("gameStart");
            
        }
        catch(err){
            socket.emit("errorMessage", err.message);

            console.error(err);
        }
    })
}

module.exports = handleStartGame;