const { getPlayers, getAlivePlayers, killPlayer, resetCurrentKill, setReady, resetReady, setSurvey } = require("../rooms");

function handleNightPhase(socket, io) {
    socket.on("nightPhase", (roomCode)=>{
        const players = getPlayers(roomCode);
        const player = players.find(p => p.id === socket.id);
        const killablePlayers = players.filter(p => p.alive && p.id !== socket.id);
        const alivePlayers = getAlivePlayers(roomCode);

        socket.emit("roleReveal", player.role);
        socket.emit("killablePlayers", killablePlayers);
        socket.emit("alivePlayers", alivePlayers.length);

    });

    socket.on("surveySubmit", (answer, roomCode)=> {
        try{
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.ready) throw new Error(`Player already submitted`);
            setSurvey(roomCode, answer, socket.id);

            const playersReady = setReady(roomCode, socket.id);
            const alivePlayers = getAlivePlayers(roomCode);
            io.to(roomCode).emit("readyStatus", playersReady);

            if(playersReady.length === alivePlayers.length){
                io.to(roomCode).emit("allReady", "nightResultsPhase");
                resetReady(roomCode);
            }
        }
        catch(err) {
            socket.emit("errorMessage", err.message);
            console.error(err)
        }
    });

    socket.on("mafiaKill", (player, roomCode)=> {
        try{
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.ready) throw new Error(`Player already killed`);

            killPlayer(roomCode, player, socket.id);

            const playersReady = setReady(roomCode, socket.id);
            const alivePlayers = getAlivePlayers(roomCode);
            io.to(roomCode).emit("readyStatus", playersReady);

            if(playersReady.length === alivePlayers.length){
                io.to(roomCode).emit("allReady", "nightResultsPhase");
                resetReady(roomCode);
            }
        }
        catch(err) {
            socket.emit("errorMessage", err.message);
            console.error(err)
        }
    });

    socket.on("nightResultsPhase", (roomCode)=> {
        try{
            const players = getPlayers(roomCode);
            const mafia = players.find(p => p.role === "Mafia");
            const villagers = players.filter(p => p.role === "Villager" && p.alive);
            const killed = players.find(p => p.name === mafia.currentKill);

            if(!mafia.currentKill){
                io.to(roomCode).emit("killed", "No one");
            }
            else{
                io.to(roomCode).emit("killed", mafia.currentKill);
                io.to(killed.id).emit("dead");
            }

            setTimeout(()=> {
                if(mafia.alive === false){
                    io.to(roomCode).emit("endPhase", "Villagers");
                }
                else if(villagers.length === 1){
                    io.to(roomCode).emit("endPhase", "Mafia");
                }
                else{
                    io.to(roomCode).emit("allReady", "dayPhase");
                }
                resetCurrentKill(roomCode, mafia.id);
            }, 5000);

            
        }
        catch(err){
            socket.emit("errorMessage", err.message);
            console.error(err);
        }
    });
}

module.exports = handleNightPhase;