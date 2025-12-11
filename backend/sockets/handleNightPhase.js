const { getPlayers, getAlivePlayers, setNightPhaseReady, resetNightPhaseReady, setCurrentKill, killPlayer, resetCurrentKill, setSurvey } = require("../rooms");

function handleNightPhase(socket, io) {
    //When night phase starts, send role, alive players, and killable players
    socket.on("nightPhase", (roomCode)=>{
        const players = getPlayers(roomCode);
        const player = players.find(p => p.id === socket.id);
        const killablePlayers = players.filter(p => p.alive && p.id !== socket.id);
        const alivePlayers = getAlivePlayers(roomCode);

        socket.emit("roleReveal", player.role);
        socket.emit("killablePlayers", killablePlayers);
        io.to(roomCode).emit("alivePlayers", alivePlayers.length);

    });

    //When a villager submits the survey, record their submission, then update everyone on who is ready
    //If everyone is ready, emit night results phase
    socket.on("surveySubmit", (answer, roomCode)=> {
        try{
            //Check if player submitted already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.nightPhaseReady) throw new Error(`Player already submitted`);

            setSurvey(roomCode, answer, socket.id);

            const playersReady = setNightPhaseReady(roomCode, socket.id);
            io.to(roomCode).emit("nightPhaseReadyStatus", playersReady);

            const alivePlayers = getAlivePlayers(roomCode);

            if(playersReady.length === alivePlayers.length){
                io.to(roomCode).emit("nightPhaseAllReady", "nightResultsPhase");
                resetNightPhaseReady(roomCode);
            }
        }
        catch(err) {
            socket.emit("errorMessage", err.message);
            setTimeout(()=> {
                socket.emit("errorMessage", "");
            }, 3000);

            console.error(err)
        }
    });

    //When a mafia kills a player, record their kill, then update everyone on who is ready
    //If everyone is ready, emit night results phase
    socket.on("mafiaKill", (player, roomCode)=> {
        try{
            //Check if player killed already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.nightPhaseReady) throw new Error(`Player already killed`);

            setCurrentKill(roomCode, player, socket.id);

            const playersReady = setNightPhaseReady(roomCode, socket.id);
            io.to(roomCode).emit("nightPhaseReadyStatus", playersReady);

            const alivePlayers = getAlivePlayers(roomCode);

            if(playersReady.length === alivePlayers.length){
                io.to(roomCode).emit("nightPhaseAllReady", "nightResultsPhase");
                resetNightPhaseReady(roomCode);
            }
        }
        catch(err) {
            socket.emit("errorMessage", err.message);
            setTimeout(()=> {
                socket.emit("errorMessage", "");
            }, 3000);

            console.error(err)
        }
    });

    //When night results phase starts, send night results, then emit next logical phase in 5 seconds
    socket.on("nightResultsPhase", (roomCode)=> {
        try{
            //Check if anyone was killed
            const players = getPlayers(roomCode);
            const mafia = players.find(p => p.role === "Mafia");
            const villagers = players.filter(p => p.role === "Villager" && p.alive);
            const killed = players.find(p => p.name === mafia.currentKill);

            if(!mafia.currentKill){
                io.to(roomCode).emit("killed", "No one");
            }
            else{
                io.to(roomCode).emit("killed", killed.name);
                io.to(killed.id).emit("dead");
                killPlayer(roomCode, killed.name);
            }

            //Calculate if win condition is met
            setTimeout(()=> {
                if(mafia.alive === false){
                    io.to(roomCode).emit("endPhase", "Villagers");
                }
                else if(villagers.length === 1){
                    io.to(roomCode).emit("endPhase", "Mafia");
                }
                else{
                    io.to(roomCode).emit("nightResultsPhaseReady", "dayPhase");
                }
                resetCurrentKill(roomCode, mafia.id);
            }, 5000);

            
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

module.exports = handleNightPhase;