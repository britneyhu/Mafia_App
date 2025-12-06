const { joinRoom, getPlayers } = require("../rooms");

function handleJoinRoom(socket, io) {
    socket.on("joinRoom", ({name, roomCode})=>{
        const room = joinRoom(name, roomCode, socket.id);

        if(room){
            socket.playerName = name;
            socket.join(roomCode);
            socket.emit("roomJoined", roomCode);
            io.to(roomCode).emit("roomPlayers", getPlayers(roomCode));

            console.log(`${socket.playerName} joined room: ${roomCode}`);
        }
        else{
            socket.emit("errorMessage", "Room Not Found");
            
            console.log(`Room not found: ${roomCode}`);
        }
    });
}


module.exports = handleJoinRoom;