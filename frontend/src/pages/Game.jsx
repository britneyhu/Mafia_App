import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [skipResults, setSkipResults] = useState([]);
    const [killed, setKilled] = useState("")
    const [alive, setAlive] = useState(true);
    const [winner, setWinner] = useState("");

    const totalPlayers = 4;

    useEffect(()=>{
        socket.on("roleReveal", (playerRole)=>{
            setRole(playerRole);
        });

        socket.on("readyStatus", (playersReady)=>{
            setNumReady(playersReady.length);
        });

        socket.on("allReady", (newPhase)=>{
            setNumReady(0);

            if(newPhase === "rolePhase"){
                setPhase("rolePhase");
            }
            
            if(newPhase === "dayPhase"){
                socket.emit("dayPhase", roomCode, 180);
                setPhase("dayPhase");
            }

            if(newPhase === "votePhase"){
                socket.emit("votePhase", roomCode);
                setPhase("votePhase");
            }

            if(newPhase === "voteResultsPhase"){
                socket.emit("voteResultsPhase", roomCode);
                setPhase("voteResultsPhase");
            }


            if(newPhase === "nightPhase"){
                socket.emit("nightPhase");
                setPhase("nightPhase");
            }
        });

        socket.on("dayTimer", (timeLeft)=> {
            setTime(timeLeft);
        });

        socket.on("alivePlayers", (players)=> {
            setAlivePlayers(players);
        })

        socket.on("voteResults", (players)=> {
            setAlivePlayers(players);
        });

        socket.on("skipResults", (skips)=> {
            setSkipResults(skips);
        });

        socket.on("killed", (killedPlayer)=>{
            setKilled(killedPlayer.name);
        });

        socket.on("dead", ()=>{
            setAlive(false);

        });

        socket.on("endPhase", (winnerTeam)=> {
            setWinner(winnerTeam);
            setPhase("endPhase");
        })

        socket.on("errorMessage", (message)=>{
            setErrorMessage(message);
        });

        return ()=>{
            socket.off("roleReveal");
            socket.off("readyStatus");
            socket.off("allReady");
            socket.off("dayTimer");
            socket.off("alivePlayers");
            socket.off("voteResults");
            socket.off("skipResults");
            socket.off("killed");
            socket.off("errorMessage");
        }

    }, []);

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
        socket.emit("roleReady", roomCode);
    }

    function handleSkipDay() {
        socket.emit("skipDay", roomCode);
    }

    function handleVote(voted) {
        socket.emit("vote", voted, roomCode);
    }

    function handleVoteReady() {
        socket.emit("voteReady", roomCode);
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
                    totalPlayers={totalPlayers}
                    phase={phase}
                />

                <Day
                    phase={phase}
                    time={time}
                    numReady={numReady}
                    totalPlayers={totalPlayers}
                    handleSkipDay={handleSkipDay}
                />

                <Vote
                    phase={phase}
                    alivePlayers={alivePlayers}
                    numReady={numReady}
                    totalPlayers={totalPlayers}
                    handleVote={handleVote}
                    skipResults={skipResults}
                    handleVoteReady={handleVoteReady}
                    killed={killed}
                />

                <Night
                    phase={phase}
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