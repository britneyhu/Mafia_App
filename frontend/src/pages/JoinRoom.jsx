import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";

function JoinRoom() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        socket.on("roomJoined", (roomCode)=>{
            navigate(`/lobby/${roomCode}`);
        });

        socket.on("errorMessage", (message)=>{
            setErrorMessage(message);
        })
    }, [navigate]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleCodeChange(e) {
        setCode(e.target.value);
    }

    function handleJoin() {
        const trimmedCode = code.trim();
        socket.emit("joinRoom", {name: name, roomCode: trimmedCode});

        setCode("");
    }

    return (
        <>
            Join Room Page
            <div>
                <label>Name</label>
                <input value={name} onChange={handleNameChange}/>
            </div>

            <div>
                <label>Room Code</label>
                <input value={code} onChange={handleCodeChange}/>
            </div>

            <button onClick={handleJoin}>Join</button>
            <p>{errorMessage}</p>
        </>
    )
}

export default JoinRoom
