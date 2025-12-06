const { createRoom } = require("../rooms");

function handleCreateRoom(socket, io) {
    socket.on("createRoom", (name) => {
        socket.playerName = name;
        const roomCode = createRoom(name, socket.id);
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);

        console.log(`${socket.playerName} created a room: ${roomCode}`);
    });
}

module.exports = handleCreateRoom;
