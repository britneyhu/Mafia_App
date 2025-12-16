const { getPlayers } = require("../rooms");

function handleToolRequests(socket, io) {
    socket.on("requestPlayers", (roomCode)=>{
        const players = getPlayers(roomCode);
        socket.emit("roomPlayers", players);
    });

    socket.on("requestName", (roomCode)=> {
        const players = getPlayers(roomCode);
        const player = players.find(p => p.id === socket.id);
        const playerName = player.name;
        socket.emit("playerName", playerName);
    })
}

module.exports = handleToolRequests;