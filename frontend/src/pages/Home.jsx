import { useEffect, useState } from "react";
import { socket } from "../utils/socket.js";

function Home() {
    const [serverMessage, setServerMessage] = useState("");
    const [userInput, setUserInput] = useState("");

    useEffect(()=> {
        socket.on("roomCreated", (roomCode) => {
            setServerMessage(`Room created: ${roomCode}`);
        });

        socket.on("roomJoined", (roomCode)=>{
            setServerMessage(`Room joined: ${roomCode}`)
        });

        socket.on("errorMessage", (message)=>{
            setServerMessage(`Error: ${message}`);
        });

        return ()=> {
            socket.off("roomCreated");
            socket.off("roomJoined");
            socket.off("errorMessage");
        };
    }, []);

    function handleCreate() {
        socket.emit("createRoom");
    }

    function handleJoin() {
        socket.emit("joinRoom", userInput.trim());
        setUserInput("");
    }

    function handleInputChange(e) {
        setUserInput(e.target.value);
    }

    return (
        <>
            <button onClick={handleCreate}>Create Room</button>

            <div>
                <input type="text" value={userInput} onChange={handleInputChange}/>
                <button onClick={handleJoin}>Join</button>
            </div>

            <p>{serverMessage}</p>
        </>
    )
}

export default Home
