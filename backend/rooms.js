const rooms = {};

/*
    Create and Join Room
*/
function createRoom(name, socketId) {
    if(!name) throw new Error("Name Cannot Be Blank");

    const roomCode = generateCode();

    rooms[roomCode] = {
        data: {
            roundNumber: 1,
            previouslySaved: "",
        },

        players: [{
            id: socketId, 
            name: name,
            rolePhaseReady: false,
            dayPhaseReady: false,
            votePhaseReady: false,
            nightPhaseReady: false,
            alive: true,
            role: null,
            votes: [],
            currentKill: false,
            currentSave: false,
        }],
    }

    return roomCode
}

function joinRoom(name, roomCode, socketId) {
    if(!name) throw new Error("Name Cannot Be Blank");
    if(!rooms[roomCode]) throw new Error("Room not found");
    if(rooms[roomCode].players.length >= 4) throw new Error("Max players in room");
    const players = getPlayers(roomCode);
    const matchingNames = players.filter(p => p.name === name);
    if(matchingNames.length > 0) throw new Error("Somone already has that name");
    
    rooms[roomCode].players.push({
        id: socketId, 
        name: name,
        rolePhaseReady: false,
        dayPhaseReady: false,
        votePhaseReady: false,
        nightPhaseReady: false,
        alive: true,
        role: null,
        votes: [],
        currentKill: false,
        currentSave: false,
    });

    return roomCode;
}


/*
    Tools
*/
function generateCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function getPlayers(roomCode) {
    return rooms[roomCode] ? rooms[roomCode].players : [];
}

function getGameData(roomCode) {
    return rooms[roomCode] ? rooms[roomCode].data : [];
}

function getAlivePlayers(roomCode) {
    const players = getPlayers(roomCode);
    const alivePlayers = players.filter(p => p.alive);
    return alivePlayers;
}

function setRoundNumber(roomCode) {
    const room = rooms[roomCode];
    room.data.round = (room.round || 1) + 1;
    return room.data.round;
}

function resetRoom(roomCode) {
    if(!rooms[roomCode]) throw new Error("Room not found");
    const room = rooms[roomCode];

    room.players.forEach(p => {
        p.rolePhaseReady = false;
        p.dayPhaseReady = false;
        p.votePhaseReady = false;
        p.nightPhaseReady = false;
        p.alive = true;
        p.role = null;
        p.votes = [];
        p.currentKill = false;
        p.currentSave = false;
    });
}


/*
    Role Phase
*/
function assignRoles(roomCode) {
    const players = getPlayers(roomCode);

    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    shuffled[0].role = "Mafia";
    shuffled[1].role = "Doctor";
    shuffled.slice(2).forEach(p => p.role = "Villager");

    return shuffled;
}

function setRolePhaseReady(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.rolePhaseReady = true;
    return players.filter(p => p.rolePhaseReady === true);
}

function resetRolePhaseReady(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => p.rolePhaseReady = false);
}


/*
    Day Phase
*/
function setDayPhaseReady(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.dayPhaseReady = true;
    return players.filter(p => p.dayPhaseReady === true);
}

function resetDayPhaseReady(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => p.dayPhaseReady = false);
}


/*
    Vote Phase
*/
function setVotePhaseReady(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.votePhaseReady = true;
    return players.filter(p => p.votePhaseReady === true);
}

function resetVotePhaseReady(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => p.votePhaseReady = false);
}

function setVotes(roomCode, voterObject, voted) {
    const players = getAlivePlayers(roomCode);

    const voterName = voterObject.name;
    const votedObject = players.find(p => p.name === voted);
    votedObject.votes.push(voterName);
}


/*
    Vote Results Phase
*/
function resetVotes(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => {
        p.votes = [];
    });
}

function voteOffPlayer(roomCode, playerName) {
    const players = getPlayers(roomCode);
    const killedPlayer = players.find(p => p.name === playerName);
    killedPlayer.alive = false;
    
}


/*
    Night Phase
*/
function setNightPhaseReady(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.nightPhaseReady = true;
    return players.filter(p => p.nightPhaseReady === true);
}

function resetNightPhaseReady(roomCode) {
    const players = getPlayers(roomCode);
    players.forEach(p => p.nightPhaseReady = false);
}

function setCurrentKill(roomCode, killedPlayerName, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    const killedPlayer = players.find(p => p.name === killedPlayerName);
    player.currentKill = killedPlayer.name;
}

function killPlayer(roomCode, killedPlayerName, playerId) {
    const players = getPlayers(roomCode);
    const killedPlayer = players.find(p => p.name === killedPlayerName);
    killedPlayer.alive = false;
}

function setSurvey(roomCode, answer, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    // player.surveys.push(answer);
}

function setCurrentSave(roomCode, savedPlayerName, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    const savedPlayer = players.find(p => p.name === savedPlayerName);
    player.currentSave = savedPlayer.name;
}


/*
    Night Results Phase
*/
function resetCurrentKill(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.currentKill = false; 
}

function resetCurrentSave(roomCode, playerId) {
    const players = getPlayers(roomCode);
    const player = players.find(p => p.id === playerId);
    player.currentSave = false;
}


module.exports = { 
    rooms, 
    createRoom, 
    joinRoom, 
    getPlayers, 
    assignRoles, 
    setRolePhaseReady, 
    resetRolePhaseReady, 
    setDayPhaseReady,
    resetDayPhaseReady,
    setVotePhaseReady,
    resetVotePhaseReady,
    setNightPhaseReady,
    resetNightPhaseReady,
    setVotes,
    resetVotes,
    killPlayer,
    setSurvey,
    resetCurrentKill,
    voteOffPlayer,
    getAlivePlayers,
    setCurrentKill,
    setRoundNumber,
    resetRoom,
    setCurrentSave,
    resetCurrentSave,
    getGameData,
};
