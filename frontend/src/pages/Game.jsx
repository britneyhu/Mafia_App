import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../utils/socket";
 
import Navbar from "../components/Navbar";
import Button from "../components/Button";

import Role from "../components/game/Role";
import Day from "../components/game/Day";

function Game() {
    const { roomCode } = useParams();
    const [rolePhase, setRolePhase] = useState(true);
    const [role, setRole] = useState("");
    const [roleVisible, setRoleVisible] = useState(false);
    const [numReady, setNumReady] = useState(0);
    const [dayPhase, setDayPhase] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const totalPlayers = 4;

    useEffect(()=>{
        socket.on("roleReveal", (playerRole)=>{
            setRole(playerRole);
        });

        socket.on("readyStatus", (playersReady)=>{
            setNumReady(playersReady.length);
        });

        socket.on("allReady", (phase)=>{
            setRolePhase(false);
            setDayPhase(false);

            if(phase === "role"){
                setRolePhase(true);
            }
            else if(phase === "day"){
                setDayPhase(true);
            }
        });

        socket.on("errorMessage", (message)=>{
            setErrorMessage(message);
        });

        return ()=>{
            socket.off("roleReveal");
            socket.off("readyStatus");
            socket.off("allReady");
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

    function handleReady() {
        socket.emit("playerReady", roomCode);
    }

    return(
        <>
            <Navbar/>
            <div className="flex flex-col gap-10 items-center mx-5">
                <div className="text-xl">
                    Game Page
                </div>

                <Role 
                    handleRoleReveal={handleRoleReveal}
                    roleVisible={roleVisible}
                    role={role}
                    handleReady={handleReady}
                    numReady={numReady}
                    totalPlayers={totalPlayers}
                    visible={rolePhase}
                />

                <Day
                    visible={dayPhase}
                />

                <div>{errorMessage}</div>
            </div>
            
        </>
    )
}

export default Game;