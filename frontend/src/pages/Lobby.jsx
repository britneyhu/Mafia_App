import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket.js";

import Navbar from "../components/Navbar";

function Lobby() {
    const { roomCode } = useParams();
    const [players, setPlayers] = useState([]);

    useEffect(()=>{
        socket.emit("requestPlayers", roomCode);

        socket.on("roomPlayers", (roomPlayers)=>{
            setPlayers(roomPlayers);
        })
    }, [roomCode])

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
            </div>
            
        </>
    )
}

export default Lobby
