const { 
    getPlayers, getAlivePlayers, setRoundNumber, setNightPhaseReady, 
    resetNightPhaseReady, setCurrentKill, killPlayer, resetCurrentKill, 
    setSurvey, setCurrentSave, resetCurrentSave, getGameData, 
    setCurrentInvestigate, resetCurrentInvestigate,
} = require("../rooms");

const roomTimers = {};

function handleNightPhase(socket, io) {
    //When night phase starts, send role, alive players, and killable players
    socket.on("nightPhase", (roomCode)=>{
        const players = getPlayers(roomCode);
        const gameData = getGameData(roomCode);
        const player = players.find(p => p.id === socket.id);
        const previouslySaved = gameData.previouslySaved;
        const guessablePlayers = players.filter(p => p.alive && p.id !== socket.id);
        const killablePlayers = players.filter(p => p.alive && p.role !== "Mafia");
        const savablePlayers = players.filter(p => p.alive && p.name !== previouslySaved);
        const investigatablePlayers = players.filter(p => p.alive && p.role !== "Detective");
        const alivePlayers = getAlivePlayers(roomCode);

        socket.emit("roleReveal", player.role);
        socket.emit("guessablePlayers", guessablePlayers);
        socket.emit("killablePlayers", killablePlayers);
        socket.emit("savablePlayers", savablePlayers);
        socket.emit("investigatablePlayers", investigatablePlayers);
        io.to(roomCode).emit("alivePlayers", alivePlayers.length);
    });

    //When a villager submits the survey, record their submission, then update everyone on who is ready
    //If everyone is ready, emit night results phase
    socket.on("surveySubmit", (answer, roomCode)=> {
        try{
            //Check if player submitted already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.nightPhaseReady) throw new Error(`Player submitted already`);

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
    socket.on("mafiaKill", (kill, roomCode)=> {
        try{
            //Check if player killed already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.nightPhaseReady) throw new Error(`Player killed already`);

            if(kill !== "Skip") setCurrentKill(roomCode, kill, socket.id);

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

            console.error(err);
        }
    });

    socket.on("doctorSave", (save, roomCode)=> {
        try{
            //Check if player saved already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            const gameData = getGameData(roomCode);
            if(playerObject.nightPhaseReady) throw new Error(`Player saved already`);
            if(gameData.previouslySaved === save) throw new Error(`Can't save the same player 2 nights in a row`);

            if(save !== "Skip"){
                setCurrentSave(roomCode, save, socket.id);
                gameData.previouslySaved = save;
            }

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

            console.error(err);
        }
    });

    socket.on("detectiveInvestigate", (investigate, roomCode)=> {
        try{
            //Check if player investigated already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.currentInvestigate || playerObject.nightPhaseReady) throw new Error(`Player cannot investigate anymore`);

            if(investigate !== "Skip"){
                const investigationResult = setCurrentInvestigate(roomCode, investigate, socket.id);
                socket.emit("investigationResult", investigationResult);
            }
            else{
                const playersReady = setNightPhaseReady(roomCode, socket.id);
                io.to(roomCode).emit("nightPhaseReadyStatus", playersReady);

                const alivePlayers = getAlivePlayers(roomCode);

                if(playersReady.length === alivePlayers.length){
                    io.to(roomCode).emit("nightPhaseAllReady", "nightResultsPhase");
                    resetNightPhaseReady(roomCode);
                }
            }
        }
        catch(err) {
            socket.emit("errorMessage", err.message);
            setTimeout(()=> {
                socket.emit("errorMessage", "");
            }, 3000);

            console.error(err);
        }
    });

    socket.on("detectiveReady", (roomCode)=> {
        try{
            //Check if player investigated already
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.nightPhaseReady) throw new Error(`Player ready already`);

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

            console.error(err);
        }
    });

    //When night results phase starts, send night results, then emit next logical phase in 5 seconds
    socket.on("nightResultsPhase", (roomCode)=> {
        try{
            //Check if anyone was killed
            const players = getPlayers(roomCode);
            const data = getGameData(roomCode);

            const mafia = players.find(p => p.role === "Mafia");
            const villagers = players.filter(p => p.role !== "Mafia" && p.alive);
            const killed = players.find(p => p.name === mafia.currentKill);

            const hero = data.hero;
            let doctor;
            let detective;
            if(hero === "Doctor"){
                doctor = players.find(p => p.role === "Doctor");
            }
            else if(hero === "Detective"){
                detective = players.find(p => p.role === "Detective");
            }
            

            if(!mafia.currentKill){
                io.to(roomCode).emit("killed", "No one");
            }
            else if(doctor && doctor.currentSave && doctor.currentSave === mafia.currentKill){
                io.to(roomCode).emit("killed", "No one");
            }
            else{
                io.to(roomCode).emit("killed", killed.name);
                io.to(killed.id).emit("dead");
                killPlayer(roomCode, killed.name, socket.id);
            }

            //Calculate if win condition is met
            let timeLeft = 6;
            const interval = setInterval(()=> {
                io.to(roomCode).emit("skipTimer", timeLeft-1);
                timeLeft--;

                if(timeLeft === 0){
                    clearInterval(interval);
                    delete roomTimers[roomCode];

                    const roundNumber = setRoundNumber(roomCode);
                    io.to(roomCode).emit("roundNumber", roundNumber);

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

                    if(doctor) resetCurrentSave(roomCode, doctor.id);
                    else if(detective) resetCurrentInvestigate(roomCode, detective.id);             
                    }
            }, 1000);

            roomTimers[roomCode] = interval;
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