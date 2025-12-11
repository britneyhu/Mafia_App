const { setReady, getPlayers, getAlivePlayers, resetReady, setVotes, resetVotes, voteOffPlayer } = require("../rooms");

const roomSkips = {};

function handleVotePhase(socket, io) {
    socket.on("votePhase", (roomCode)=> {
        const alivePlayers = getAlivePlayers(roomCode);
        io.to(roomCode).emit("alivePlayers", alivePlayers);
    });

    socket.on("vote", (voted, roomCode)=> {
        try{
            const players = getAlivePlayers(roomCode);
            const voterObject = players.find(p => p.id === socket.id);
            if(voterObject.ready) throw new Error(`voter already voted`);
            
            if(voted === "skip"){
                if(!roomSkips[roomCode]){
                    roomSkips[roomCode] = [];
                }
                roomSkips[roomCode].push(voterObject.name);
            }
            else{
                setVotes(roomCode, voterObject, voted);
            }

            const playersReady = setReady(roomCode, socket.id);
            const totalPlayers = getAlivePlayers(roomCode).length;
            io.to(roomCode).emit("readyStatus", playersReady);

            if(playersReady.length === totalPlayers){
                io.to(roomCode).emit("allReady", "voteResultsPhase");
            }
        }
        catch(err){
            socket.emit("errorMessage", err.message);
            console.error(err);
        }
        
    });

    socket.on("voteResultsPhase", (roomCode)=> {
        const players = getPlayers(roomCode);
        const numVotes = players.reduce((sum, p) => sum + p.votes.length, 0);
        const maxVotes = Math.max(...players.map(p => p.votes.length));
        const maxVotedPlayers = players.filter(p => p.votes.length === maxVotes);
        const skips = roomSkips[roomCode] || [];
        
        if(maxVotedPlayers.length > 1){
            io.to(roomCode).emit("votedOff", "No One");
        }
        else if(skips.length >= numVotes){
            io.to(roomCode).emit("votedOff", "No One");
        }
        else{
            io.to(roomCode).emit("votedOff", maxVotedPlayers[0].name);
            io.to(maxVotedPlayers[0].id).emit("dead");
            voteOffPlayer(roomCode, maxVotedPlayers[0].name);
        }

        io.to(roomCode).emit("voteResults", players);
        io.to(roomCode).emit("skipResults", skips);

        const mafia = players.find(p => p.role === "Mafia");
        const villagers = players.filter(p => p.role === "Villager" && p.alive);

        setTimeout(()=> {
            if(mafia.alive === false){
                io.to(roomCode).emit("endPhase", "Villagers");
            }
            else if(villagers.length === 1){
                io.to(roomCode).emit("endPhase", "Mafia");
            }
            else{
                io.to(roomCode).emit("allReady", "nightPhase");
            }
            resetReady(roomCode);
            resetVotes(roomCode);
        }, 5000);
    });
}

module.exports = handleVotePhase;