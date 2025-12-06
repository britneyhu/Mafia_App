const { getPlayers } = require("../rooms");

function handleRequestPlayers(socket, io) {
    socket.on("requestPlayers", (roomCode)=>{
        const players = getPlayers(roomCode);
        socket.emit("roomPlayers", players);
    });
}

module.exports = handleRequestPlayers;