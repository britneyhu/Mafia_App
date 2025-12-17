const { createRoom } = require("../rooms");

function handleCreateRoom(socket, io) {
    socket.on("createRoom", (name) => {
        try{
            const trimmedName = name.trim();
            socket.playerName = trimmedName;
            const roomCode = createRoom(trimmedName, socket.id);
            socket.join(roomCode);
            socket.emit("roomCreated", roomCode);

            console.log(`${socket.playerName} created a room: ${roomCode}`);
        }
        catch(err){
            socket.emit("errorMessage", err.message);

            console.error(err);
            setTimeout(()=> {
                socket.emit("errorMessage", "");
            }, 3000);
        }
        
    });
}

module.exports = handleCreateRoom;
