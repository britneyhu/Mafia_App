const { getPlayers, getAlivePlayers, setRolePhaseReady, resetRolePhaseReady } = require("../rooms");

function handleRolePhase(socket, io) {
    //When a player requests their role, give them their role
    socket.on("requestRole", (roomCode)=>{
        try{
            const players = getPlayers(roomCode);
            const player = players.find(player => player.id === socket.id);

            if(!player) throw new Error("Player id not found");
            socket.emit("roleReveal", player.role);
        }
        catch(err){
            socket.emit("errorMessage", err.message);
            setTimeout(()=> {
                socket.emit("errorMessage", "");
            }, 3000);

            console.error(err);
        }
        
    })
    
    //When a player presses ready, set them as ready, then update everyone on who is ready
    //If everyone is ready, reset readys and emit day phase
    socket.on("rolePhaseReady", (roomCode)=>{
        try{
            //Check if player has pressed ready already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.rolePhaseReady) throw new Error(`Player already ready`);

            const playersReady = setRolePhaseReady(roomCode, socket.id);
            io.to(roomCode).emit("rolePhaseReadyStatus", playersReady);

            const alivePlayers = getAlivePlayers(roomCode);

            if(playersReady.length === alivePlayers.length){
                io.to(roomCode).emit("rolePhaseAllReady", "dayPhase");
                resetRolePhaseReady(roomCode);
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

module.exports = handleRolePhase;