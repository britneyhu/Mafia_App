const rooms = {};

function generateCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function createRoom(name, socketId) {
    const roomCode = generateCode();

    rooms[roomCode] = {
        players: [{id: socketId, name: name}],
    }

    return roomCode
}

function joinRoom(name, roomCode, socketId) {
    if(!rooms[roomCode]) return null;
    rooms[roomCode].players.push({id: socketId, name: name});
    return rooms[roomCode];
}

function getPlayers(roomCode) {
    return rooms[roomCode] ? rooms[roomCode].players : [];
}

module.exports = { rooms, createRoom, joinRoom, getPlayers };
