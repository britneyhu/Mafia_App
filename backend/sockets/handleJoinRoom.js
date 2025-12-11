const { joinRoom, getPlayers } = require("../rooms");

function handleJoinRoom(socket, io) {
    socket.on("joinRoom", ({name, roomCode})=>{
        try{
            const trimmedName = name.trim();
            joinRoom(trimmedName, roomCode, socket.id);

            socket.playerName = name;
            socket.join(roomCode);
            socket.emit("roomJoined", roomCode);
            
            io.to(roomCode).emit("roomPlayers", getPlayers(roomCode));

            console.log(`${socket.playerName} joined room: ${roomCode}`);
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