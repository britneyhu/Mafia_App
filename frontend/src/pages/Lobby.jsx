import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";

import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Lobby() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        socket.emit("requestPlayers", roomCode);

        socket.on("roomPlayers", (roomPlayers)=>{
            setPlayers(roomPlayers);
        });

        socket.on("gameStart", ()=>{
            navigate(`/game/${roomCode}`);
        });

        socket.on("errorMessage", (message)=>{
            setErrorMessage(message)
        });

        return ()=> {
            socket.off("requestPlayers");
            socket.off("roomPlayers");
            socket.off("gameStart");
            socket.off("errorMessage");
        };
    }, [roomCode, navigate])

    function handleStartGame() {
        socket.emit("startGame", roomCode);

    }

    return (
        <>
            <Navbar/>
            <div className="flex flex-col gap-10 items-center mx-5">
                <div className="text-xl">
                    Lobby Page
                </div>

                <div className="text-xl">
                    Room Code: {roomCode}
                </div>

                <div className="self-start">
                    <p className="text-xl">Players</p>
                    <ul className="list-disc list-inside p-4">
                        {players.map((player)=>(
                            <li 
                                key={player.id}
                                className="mb-2"
                            >
                                {player.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>{errorMessage}</div>

                <Button onClick={handleStartGame}>Start Game</Button>
                
            </div>
            
        </>
    )
}

export default Lobby
