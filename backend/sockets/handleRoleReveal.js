const { getPlayers } = require("../rooms");

function handleRoleReveal(socket, io) {
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
}

module.exports = handleRoleReveal;