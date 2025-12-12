const { getPlayers, getAlivePlayers, setVotePhaseReady, resetVotePhaseReady, setVotes, resetVotes, voteOffPlayer  } = require("../rooms");

const roomSkips = {};
const roomTimers = {};

function handleVotePhase(socket, io) {
    //When vote phase starts, send alive players and votable players
    socket.on("votePhase", (roomCode)=> {
        const players = getPlayers(roomCode);
        const votablePlayers = players.filter(p => p.alive && p.id !== socket.id);
        const alivePlayers = getAlivePlayers(roomCode);

        socket.emit("votablePlayers", votablePlayers);
        io.to(roomCode).emit("alivePlayers", alivePlayers.length);
    });

    //When a player votes, record their vote, then update everyone on who voted
    //If everyone has voted, emit vote results phase
    socket.on("vote", (voted, roomCode)=> {
        try{
            //Check if player voted already
            const players = getPlayers(roomCode);
            const voterObject = players.find(p => p.id === socket.id);
            if(voterObject.votePhaseReady) throw new Error(`voter already voted`);
            
            if(voted === "skip"){
                if(!roomSkips[roomCode]){
                    roomSkips[roomCode] = [];
                }
                roomSkips[roomCode].push(voterObject.name);
            }
            else{
                setVotes(roomCode, voterObject, voted);
            }

            const playersReady = setVotePhaseReady(roomCode, socket.id);
            io.to(roomCode).emit("votePhaseReadyStatus", playersReady);

            const alivePlayers = getAlivePlayers(roomCode);

            if(playersReady.length === alivePlayers.length){
                io.to(roomCode).emit("votePhaseAllReady", "voteResultsPhase");
                resetVotePhaseReady(roomCode);
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


    //When vote results phase starts, send voting results, emit next logical phase after 5 seconds
    socket.on("voteResultsPhase", (roomCode)=> {
        //Calculate who has the highest votes (or no one)
        const votingPlayers = getAlivePlayers(roomCode);
        const maxVotes = Math.max(...votingPlayers.map(p => p.votes.length));
        const maxVotedPlayers = votingPlayers.filter(p => p.votes.length === maxVotes);
        const skips = roomSkips[roomCode] || [];
        let votedOff = false;

        //tied in votes
        if(maxVotedPlayers.length > 1){
            io.to(roomCode).emit("votedOff", "No One");
        }
        //one person has majority votes
        else if((maxVotes / votingPlayers.length) > 0.5){
            io.to(roomCode).emit("votedOff", maxVotedPlayers[0].name);
            votedOff = maxVotedPlayers[0];
        }
        else{
            io.to(roomCode).emit("votedOff", "No One");
        }

        //Send results
        io.to(roomCode).emit("voteResults", votingPlayers);
        io.to(roomCode).emit("skipResults", skips);

        //Calculate if win condition is met
        const players = getPlayers(roomCode);
        const villagers = players.filter(p => (p.role === "Villager" || p.role === "Doctor") && p.alive);

        let timeLeft = 6;
        const interval = setInterval(()=> {
            io.to(roomCode).emit("skipTimer", timeLeft-1);
            timeLeft--;

            if(timeLeft === 0){
                clearInterval(interval);
                delete roomTimers[roomCode];

                if(votedOff.role === "Mafia"){
                    io.to(roomCode).emit("endPhase", "Villagers");
                }
                else if(villagers.length <= 2){
                    io.to(roomCode).emit("endPhase", "Mafia");
                }
                else{
                    io.to(roomCode).emit("voteResultsAllReady", "nightPhase");
                }

                if(votedOff){
                    io.to(votedOff.id).emit("dead");
                    voteOffPlayer(roomCode, votedOff.name);
                }
                
                resetVotes(roomCode);
                roomSkips[roomCode] = [];
            }
        }, 1000);

        roomTimers[roomCode] = interval;
    });
}

module.exports = handleVotePhase;