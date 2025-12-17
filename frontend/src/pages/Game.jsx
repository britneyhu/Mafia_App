import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
 
import Navbar from "../components/Navbar";

import Role from "../components/game/Role";
import Day from "../components/game/Day";
import Vote from "../components/game/Vote";
import Night from "../components/game/Night";
import End from "../components/game/End";
import Dead from "../components/game/Dead";

function Game() {
    const { roomCode } = useParams();
    const [name, setName] = useState("");
    const [phase, setPhase] = useState("role");
    const [role, setRole] = useState("");
    const [navRoleVisible, setNavRoleVisible] = useState(false);
    const [roleVisible, setRoleVisible] = useState(false);
    const [numReady, setNumReady] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [dayTime, setDayTime] = useState(180);
    const [skipTime, setSkipTime] = useState(5);
    const [skipResults, setSkipResults] = useState([]);
    const [votedOff, setVotedOff] = useState("");
    const [killed, setKilled] = useState("");
    const [alive, setAlive] = useState(true);
    const [winner, setWinner] = useState("");
    const [killablePlayers, setKillablePlayers] = useState([]);
    const [votablePlayers, setVotablePlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState(0);
    const [roundNumber, setRoundNumber] = useState(1);
    const [savablePlayers, setSavablePlayers] = useState([]);
    const [investigatablePlayers, setInvestigatablePlayers] = useState([]);
    const [investigationResult, setInvestigationResult] = useState("none");
    const [guessablePlayers, setGuessablePlayers] = useState([]);
    const [readyPressed, setReadyPressed] = useState(false);
    const [playerVote, setPlayerVote] = useState("");
    const [guessedPlayer, setGuessedPlayer] = useState("");
    const [killedPlayer, setKilledPlayer] = useState("");
    const [savedPlayer, setSavedPlayer] = useState("");
    const [investigatedPlayer, setInvestigatedPlayer] = useState("");
    const [detectiveReadyPressed, setDetectiveReadyPressed] = useState(false);

    useEffect(()=>{
        socket.emit("requestAlivePlayers", roomCode);
        socket.emit("requestName", roomCode);

        {/* Role Phase Sockets */}
        socket.on("rolePhaseReadyStatus", (playersReady)=>{
            setNumReady(playersReady.length);
        });
        socket.on("rolePhaseAllReady", ()=> {
            setNumReady(0);
            socket.emit("dayPhase", roomCode, 180);
            setPhase("dayPhase");
            setReadyPressed(false);
        })



        {/* Day Phase Sockets */}
        socket.on("dayTimer", (timeLeft)=> {
            setDayTime(timeLeft);
        });
        socket.on("dayPhaseReadyStatus", (playersReady)=> {
            setNumReady(playersReady.length);
        });
        socket.on("dayPhaseAllReady", ()=> {
            setNumReady(0);
            setDayTime(180);
            setSkipTime(60);
            socket.emit("votePhase", roomCode);
            setPhase("votePhase");
            setReadyPressed(false);
        });


        {/* Vote Phase Sockets */}
        socket.on("votablePlayers", (players)=> {
            setVotablePlayers(players);
        });
        socket.on("votePhaseReadyStatus", (playersReady)=> {
            setNumReady(playersReady.length);
        });
        socket.on("votePhaseAllReady", ()=> {
            setNumReady(0);
            setSkipTime(5);
            socket.emit("voteResultsPhase", roomCode);
            setPhase("voteResultsPhase");
            setReadyPressed(false);
            setPlayerVote("");
        });


        {/* Vote Results Phase Sockets */}
        socket.on("voteResults", (players)=> {
            setVotablePlayers(players);
            setAlivePlayers(players);
        });
        socket.on("skipResults", (skips)=> {
            setSkipResults(skips);
        });
        socket.on("votedOff", (player)=>{
            setVotedOff(player);
        });
        socket.on("voteResultsAllReady", ()=> {
            socket.emit("nightPhase", roomCode);
            setSkipTime(5);
            setPhase("nightPhase");
        });
        socket.on("skipTimer", (timeLeft)=> {
            setSkipTime(timeLeft);
        });


        {/* Night Phase Sockets */}
        socket.on("guessablePlayers", (players)=> {
            setGuessablePlayers(players);
        });
        socket.on("killablePlayers", (players)=> {
            setKillablePlayers(players);
        });
        socket.on("savablePlayers", (players)=> {
            setSavablePlayers(players);
        });
        socket.on("investigatablePlayers", (players)=> {
            setInvestigatablePlayers(players);
        });
        socket.on("investigationResult", (result)=> {
            setInvestigationResult(result);
        })
        socket.on("nightPhaseReadyStatus", (playersReady)=> {
            setNumReady(playersReady.length);
        });
        socket.on("nightPhaseAllReady", ()=> {
            setNumReady(0);
            setInvestigationResult("none");
            socket.emit("nightResultsPhase", roomCode);
            setPhase("nightResultsPhase");
            setReadyPressed(false);
            setGuessedPlayer("");
            setKilledPlayer("");
            setSavedPlayer("");
            setInvestigatedPlayer("");
            setDetectiveReadyPressed(false);
        });

        {/* Night Results Phase Sockets */}
        socket.on("killed", (result)=> {
            setKilled(result);
        });
        socket.on("nightResultsPhaseReady", ()=> {
            setSkipTime(5);
            socket.emit("dayPhase", roomCode, 180);
            setPhase("dayPhase");
        });
        socket.on("skipTimer", (timeLeft)=> {
            setSkipTime(timeLeft);
        });


        {/* End Phase Sockets */}
        socket.on("endPhase", (winnerTeam)=> {
            setWinner(winnerTeam);
            setPhase("endPhase");
        });
        socket.on("gameRestarted", ()=>{
            setRoundNumber(1);
            setPhase("role");
            setRoleVisible(false);
            setAlive(true);
            setDayTime(180);
            setSkipTime(5);
        })


        {/* Tool Sockets */}
        socket.on("dead", ()=>{
            setAlive(false);
        });
        socket.on("alivePlayers", (players)=> {
            setAlivePlayers(players);
        });
        socket.on("roleReveal", (playerRole)=>{
            setRole(playerRole);
        });
        socket.on("roundNumber", (number)=>{
            setRoundNumber(number);
        });
        socket.on("playerName", (playerName)=> {
            setName(playerName);
        })

        
        {/* Error Sockets */}
        socket.on("errorMessage", (message)=>{
            setErrorMessage(message);
        });


        {/* Socket Offs */}
        return ()=>{
            socket.off("endPhase");
            socket.off("rolePhaseReadyStatus");
            socket.off("rolePhaseAllReady");
            socket.off("dayTimer");
            socket.off("dayPhaseReadyStatus");
            socket.off("dayPhaseAllReady");
            socket.off("votablePlayers");
            socket.off("votePhaseReadyStatus");
            socket.off("votePhaseAllReady");
            socket.off("voteResults");
            socket.off("skipResults");
            socket.off("votedOff");
            socket.off("voteResultsAllReady");
            socket.off("killablePlayers");
            socket.off("nightPhaseReadyStatus");
            socket.off("nightPhaseAllReady");
            socket.off("killed");
            socket.off("dead");
            socket.off("alivePlayers");
            socket.off("roleReveal");
            socket.off("errorMessage");
            socket.off("skipTimer");
            socket.off("guessablePlayers");
            socket.off("savablePlayers");
            socket.off("investigatablePlayers");
            socket.off("investigationResult");
            socket.off("nightResultsPhaseReady");
            socket.off("gameRestarted");
            socket.off("roundNumber");
            socket.off("playerName")
        }

    }, []);
    
    {/* Nav Handlers */}
    function handleNavRoleReveal() {
        if(!navRoleVisible){
            socket.emit("requestRole", roomCode);
            setNavRoleVisible(true);
        }
        else{
            setNavRoleVisible(false);
        }
    }

    {/* Role Phase Handlers */}
    function handleRoleReveal() {
        if(!roleVisible){
            socket.emit("requestRole", roomCode);
            setRoleVisible(true);
        }
        else{
            setRoleVisible(false);
        }
    }
    function handleRoleReady() {
        socket.emit("rolePhaseReady", roomCode);
        setReadyPressed(true);
    }

    {/* Day Phase Handlers */}
    function handleSkipDay() {
        socket.emit("skipDay", roomCode);
        setReadyPressed(true);
    }

    {/* Vote Phase Handlers */}
    function handleVote(voted) {
        socket.emit("vote", voted, roomCode);
        setReadyPressed(true);
        setPlayerVote(voted);
    }

    {/* Night Phase Handlers */}
    function handleSurveySubmit(answer) {
        socket.emit("surveySubmit", answer, roomCode);
        setReadyPressed(true);
        setGuessedPlayer(answer);
    }
    function handleMafiaKill(player) {
        socket.emit("mafiaKill", player, roomCode);
        setReadyPressed(true);
        setKilledPlayer(player);
    }
    function handleDoctorSave(player) {
        socket.emit("doctorSave", player, roomCode);
        setReadyPressed(true);
        setSavedPlayer(player);
    }
    function handleDetectiveInvestigate(player) {
        socket.emit("detectiveInvestigate", player, roomCode);
        setReadyPressed(true);
        setInvestigatedPlayer(player);
    }
    function handleDetectiveReady() {
        socket.emit("detectiveReady", roomCode);
        setReadyPressed(true);
        setDetectiveReadyPressed(true);
    }

    {/* End Phase Handlers */}
    function handleRestartGame() {
        socket.emit("restartGame", roomCode);
    }

    return(
        <>
            <Navbar
                phase={phase}
                navRoleVisible={navRoleVisible}
                handleNavRoleReveal={handleNavRoleReveal}
                role={role}
                name={name}
            />
            <div className="flex flex-col gap-10 items-center mx-5">
                <Role 
                    handleRoleReveal={handleRoleReveal}
                    roleVisible={roleVisible}
                    role={role}
                    handleRoleReady={handleRoleReady}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    phase={phase}
                    alive={alive}
                    readyPressed={readyPressed}
                />

                <Day
                    phase={phase}
                    dayTime={dayTime}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleSkipDay={handleSkipDay}
                    roundNumber={roundNumber}
                    alive={alive}
                    readyPressed={readyPressed}
                />

                <Vote
                    phase={phase}
                    votablePlayers={votablePlayers}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleVote={handleVote}
                    skipResults={skipResults}
                    votedOff={votedOff}
                    roundNumber={roundNumber}
                    skipTime={skipTime}
                    alive={alive}
                    readyPressed={readyPressed}
                    playerVote={playerVote}
                />

                <Night
                    phase={phase}
                    role={role}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleSurveySubmit={handleSurveySubmit}
                    handleMafiaKill={handleMafiaKill}
                    killablePlayers={killablePlayers}
                    killed={killed}
                    roundNumber={roundNumber}
                    skipTime={skipTime}
                    handleDoctorSave={handleDoctorSave}
                    savablePlayers={savablePlayers}
                    investigatablePlayers={investigatablePlayers}
                    handleDetectiveInvestigate={handleDetectiveInvestigate}
                    investigationResult={investigationResult}
                    handleDetectiveReady={handleDetectiveReady}
                    guessablePlayers={guessablePlayers}
                    alive={alive}
                    readyPressed={readyPressed}
                    guessedPlayer={guessedPlayer}
                    killedPlayer={killedPlayer}
                    savedPlayer={savedPlayer}
                    investigatedPlayer={investigatedPlayer}
                    detectiveReadyPressed={detectiveReadyPressed}
                />

                <End
                    phase={phase}
                    winner={winner}
                    handleRestartGame={handleRestartGame}
                    alive={alive}
                />

                <Dead
                    alive={alive}
                    phase={phase}
                />

                <div>{errorMessage}</div>
            </div>
            
        </>
    )
}

export default Game;