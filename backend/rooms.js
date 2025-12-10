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
            alive: true,
            role: undefined,
            votes: [],
            surveys: [],
            kills: [],
        }],
    }

    return roomCode
}

function joinRoom(name, roomCode, socketId) {
    if(!rooms[roomCode]) throw new Error("Room not found");
    if(rooms[roomCode].players.length >= 4) throw new Error("Max players in room");
    
    rooms[roomCode].players.push({
        id: socketId, 
        name: name,
        ready: false,
        alive: true,
        role: undefined,
        votes: [],
        surveys: [],
        kills: [],
    });
    return roomCode;
}

function getPlayers(roomCode) {
    return rooms[roomCode] ? rooms[roomCode].players : [];
}

function getAlivePlayers(roomCode) {
    const players = getPlayers(roomCode);
    return players.filter(p => p.alive);
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

function resetReady(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => p.ready = false);
}

function setVotes(roomCode, voterObject, voted) {
    const players = getAlivePlayers(roomCode);
    voterObject.voted = true;

    const voterName = voterObject.name;
    const votedObject = players.find(p => p.name === voted);
    votedObject.votes.push(voterName);
}

function resetVotes(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => {
        p.votes = [];
        p.voted = false;
    });
}

function killPlayer(roomCode, playerName, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    const killedPlayer = players.find(p => p.name === playerName);
    killedPlayer.alive = false;
    player.kills.push(killedPlayer);
    
}

function setSurvey(roomCode, answer, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.surveys.push(answer);
}

module.exports = { 
    rooms, 
    createRoom, 
    joinRoom, 
    getPlayers, 
    getAlivePlayers, 
    assignRoles, 
    setReady, 
    resetReady, 
    setVotes,
    resetVotes,
    killPlayer,
    setSurvey,
};
