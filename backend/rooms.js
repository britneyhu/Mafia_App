const rooms = {};

function generateCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function createRoom(name, socketId) {
    const roomCode = generateCode();

    rooms[roomCode] = {
        players: [{
            id: socketId, 
            name: name,
            ready: false,
        }],
    }

    return roomCode
}

function joinRoom(name, roomCode, socketId) {
    if(!rooms[roomCode]) throw new Error("Room not found");
    if(rooms[roomCode].players.length >= 4) throw new Error("Max players in room");
    
    rooms[roomCode].players.push({id: socketId, name: name});
    return roomCode;
}

function getPlayers(roomCode) {
    return rooms[roomCode] ? rooms[roomCode].players : [];
}

function assignRoles(roomCode) {
    const players = getPlayers(roomCode);

    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    shuffled[0].role = "Mafia";
    shuffled.slice(1).forEach(p => p.role = "Villager");

    return shuffled;
}

function setReady(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.ready = true;
    return players.filter(p => p.ready === true);
}

function resetReady(roomCode){
    const players = getPlayers(roomCode);
    players.forEach(p => p.ready = false);
}

module.exports = { rooms, createRoom, joinRoom, getPlayers, assignRoles, setReady, resetReady };
