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
    const [time, setTime] = useState("");
    const [skipResults, setSkipResults] = useState([]);
    const [votedOff, setVotedOff] = useState("");
    const [killed, setKilled] = useState("");
    const [alive, setAlive] = useState(true);
    const [winner, setWinner] = useState("");
    const [killablePlayers, setKillablePlayers] = useState([]);
    const [votablePlayers, setVotablePlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState(0);

    useEffect(()=>{
        socket.emit("requestAlivePlayers", roomCode);

        {/* End Phase Sockets */}

        socket.on("endPhase", (winnerTeam)=> {
            setWinner(winnerTeam);
            setPhase("endPhase");
        });

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
            setTime(timeLeft);
        });
        socket.on("dayPhaseReadyStatus", (playersReady)=> {
            setNumReady(playersReady.length);
        });
        socket.on("dayPhaseAllReady", ()=> {
            setNumReady(0);
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
            setPhase("nightPhase");
        });


        {/* Night Phase Sockets */}
        socket.on("killablePlayers", (players)=> {
            setKillablePlayers(players);
        });
        socket.on("nightPhaseReadyStatus", (playersReady)=> {
            setNumReady(playersReady.length);
        });
        socket.on("nightPhaseAllReady", ()=> {
            setNumReady(0);
            socket.emit("nightResultsPhase", roomCode);
            setPhase("nightResultsPhase");
        });

        {/* Night Results Phase Sockets */}
        socket.on("killed", (result)=> {
            setKilled(result);
        });
        socket.on("nightResultsPhaseReady", ()=> {
            setNumReady(0);
            socket.emit("dayPhase", roomCode, 180);
            setPhase("dayPhase");
        });


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
                    time={time}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleSkipDay={handleSkipDay}
                />

                <Vote
                    phase={phase}
                    votablePlayers={votablePlayers}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleVote={handleVote}
                    skipResults={skipResults}
                    votedOff={votedOff}
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
                />

                <End
                    phase={phase}
                    winner={winner}
                />

                <div>{errorMessage}</div>
            </div>
            
        </>
    )
}

export default Game;