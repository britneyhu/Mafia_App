const { getPlayers, getAlivePlayers, killPlayer, setReady, resetReady, setSurvey } = require("../rooms");

function handleNightPhase(socket, io) {
    socket.on("nightPhase", (roomCode)=>{
        const players = getPlayers(roomCode);
        const player = players.find(player => player.id === socket.id);
        const alivePlayers = getAlivePlayers(roomCode);
        alivePlayers.filter(p => p.id !== socket.id);
        socket.emit("roleReveal", player.role);
        socket.emit("alivePlayers", alivePlayers);

    });

    socket.on("surveySubmit", (answer, roomCode)=> {
        try{
            const players = getPlayers(roomCode);
            const playerObject = players.find(p => p.id === socket.id);
            if(playerObject.ready) throw new Error(`Player already submitted`);
            setSurvey(roomCode, answer, socket.id);

            const playersReady = setReady(roomCode, socket.id);
            const totalPlayers = getPlayers(roomCode).length;
            io.to(roomCode).emit("readyStatus", playersReady);

            if(playersReady.length === totalPlayers){
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
            const totalPlayers = getPlayers(roomCode).length;
            io.to(roomCode).emit("readyStatus", playersReady);

            if(playersReady.length === totalPlayers){
                io.to(roomCode).emit("allReady", "nightResultsPhase");
                resetReady(roomCode);
            }
        }
        catch(err) {
            socket.emit("errorMessage", err.message);
            console.error(err)
        }
    })
}

module.exports = handleNightPhase;