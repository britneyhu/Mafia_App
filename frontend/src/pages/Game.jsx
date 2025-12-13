import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
 
import Navbar from "../components/Navbar";

import Role from "../components/game/Role";
import Day from "../components/game/Day";
import Vote from "../components/game/Vote";
import Night from "../components/game/Night";
import End from "../components/game/End";

function Game() {
    const { roomCode } = useParams();
    const [phase, setPhase] = useState("role");
    const [role, setRole] = useState("");
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

    useEffect(()=>{
        socket.emit("requestAlivePlayers", roomCode);

        {/* Role Phase Sockets */}
        socket.on("rolePhaseReadyStatus", (playersReady)=>{
            setNumReady(playersReady.length);
        });
        socket.on("rolePhaseAllReady", ()=> {
            setNumReady(0);
            socket.emit("dayPhase", roomCode, 180);
            setPhase("dayPhase");
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
        }

    }, []);

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
    }

    {/* Day Phase Handlers */}
    function handleSkipDay() {
        socket.emit("skipDay", roomCode);
    }

    {/* Vote Phase Handlers */}
    function handleVote(voted) {
        socket.emit("vote", voted, roomCode);
    }

    {/* Night Phase Handlers */}
    function handleSurveySubmit(answer) {
        socket.emit("surveySubmit", answer, roomCode);
    }
    function handleMafiaKill(player) {
        socket.emit("mafiaKill", player, roomCode);
    }
    function handleDoctorSave(player) {
        socket.emit("doctorSave", player, roomCode);
    }
    function handleDetectiveInvestigate(player) {
        socket.emit("detectiveInvestigate", player, roomCode);
    }
    function handleDetectiveReady() {
        socket.emit("detectiveReady", roomCode);
    }

    {/* End Phase Handlers */}
    function handleRestartGame() {
        socket.emit("restartGame", roomCode);
    }

    return(
        <>
            <Navbar/>
            <div className="flex flex-col gap-10 items-center mx-5">
                <div className="text-xl">
                    Game Page
                </div>

                <div className={alive ? "hidden" : "flex"}>
                    Spectating
                </div>

                <Role 
                    handleRoleReveal={handleRoleReveal}
                    roleVisible={roleVisible}
                    role={role}
                    handleRoleReady={handleRoleReady}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    phase={phase}
                />

                <Day
                    phase={phase}
                    dayTime={dayTime}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleSkipDay={handleSkipDay}
                    roundNumber={roundNumber}
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
                />

                <End
                    phase={phase}
                    winner={winner}
                    handleRestartGame={handleRestartGame}
                />

                <div>{errorMessage}</div>
            </div>
            
        </>
    )
}

export default Game;