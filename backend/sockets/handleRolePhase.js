const { setReady, getPlayers, resetReady } = require("../rooms");

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
        const totalPlayers = getPlayers(roomCode).length;

        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === totalPlayers){
            io.to(roomCode).emit("allReady", "dayPhase");
            resetReady(roomCode);
        }
    });
}

module.exports = handleRolePhase;