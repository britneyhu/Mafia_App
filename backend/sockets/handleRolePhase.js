const { setReady, getPlayers, getAlivePlayers, resetReady } = require("../rooms");

function handleRolePhase(socket, io) {
    socket.on("requestRole", (roomCode)=>{
        try{
            const players = getPlayers(roomCode);
            const player = players.find(player => player.id === socket.id);

            if(!player) throw new Error("Player Id Not Found");
            socket.emit("roleReveal", player.role);
        }
        catch(err){
            socket.emit("errorMessage", err.message);
            console.error(err);
        }
        
    })
    
    socket.on("roleReady", (roomCode)=>{
        const playersReady = setReady(roomCode, socket.id);
        const alivePlayers = getAlivePlayers(roomCode);

        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === alivePlayers.length){
            io.to(roomCode).emit("allReady", "dayPhase");
            resetReady(roomCode);
        }
    });
}

module.exports = handleRolePhase;