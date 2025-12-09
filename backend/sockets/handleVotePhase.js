const { setReady, getAlivePlayers, resetReady, setVotes } = require("../rooms");

const roomSkips = {};

function handleVotePhase(socket, io) {
    socket.on("votePhase", (roomCode)=> {
        const alivePlayers = getAlivePlayers(roomCode);
        io.to(roomCode).emit("alivePlayers", alivePlayers);
    });

    socket.on("vote", (voted, roomCode)=> {
        const players = getAlivePlayers(roomCode);
        const voterObject = players.find(p => p.id === socket.id);
        const voter = voterObject.name;

        if(voted === "skip"){
            if(!roomSkips[roomCode]){
                roomSkips[roomCode] = [];
            }
            roomSkips[roomCode].push(voter);
        }
        else{
            setVotes(roomCode, voter, voted);
        }

        const playersReady = setReady(roomCode, socket.id);
        const totalPlayers = getAlivePlayers(roomCode).length;
        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === totalPlayers){
            io.to(roomCode).emit("allReady", "voteResultsPhase");
            resetReady(roomCode);
        }
    });

    socket.on("voteResultsPhase", (roomCode)=> {
        const players = getAlivePlayers(roomCode);
        socket.emit("voteResults", players);
        socket.emit("skipResults", roomSkips[roomCode]);
    });

    socket.on("voteReady", (roomCode)=> {
        const playersReady = setReady(roomCode, socket.id);
        const totalPlayers = getAlivePlayers(roomCode).length;
        io.to(roomCode).emit("readyStatus", playersReady);

        if(playersReady.length === totalPlayers){
            io.to(roomCode).emit("allReady", "nightPhase");
            resetReady(roomCode);
        }
    })
}

module.exports = handleVotePhase;