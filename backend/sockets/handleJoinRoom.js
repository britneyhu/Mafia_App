const { joinRoom, getPlayers } = require("../rooms");

function handleJoinRoom(socket, io) {
    socket.on("joinRoom", ({name, roomCode})=>{
        try{
            const trimmedName = name.trim();
            const trimmedRoomCode = roomCode.trim().toUpperCase();
            joinRoom(trimmedName, trimmedRoomCode, socket.id);

            socket.playerName = name;
            socket.join(trimmedRoomCode);
            socket.emit("roomJoined", trimmedRoomCode);
            
            io.to(trimmedRoomCode).emit("roomPlayers", getPlayers(trimmedRoomCode));

            console.log(`${socket.playerName} joined room: ${trimmedRoomCode}`);
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


module.exports = handleJoinRoom;