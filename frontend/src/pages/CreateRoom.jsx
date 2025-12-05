import { useState, useEffect } from "react";
import { socket } from "../utils/socket.js";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    useEffect(()=>{
        socket.on("roomCreated", (roomCode)=> {
            navigate(`/lobby/${roomCode}`);
        });

    },[navigate])
    
    function handleChange(e) {
        setName(e.target.value);
    }

    function handleSubmit() {
        socket.emit("createRoom", name);
    }
    
    return (
        <>
            <div>
                <p>Create Room Page</p>
                
                <div>
                    <label>Name</label>
                    <input value={name} onChange={handleChange}/>
                </div>
                <button onClick={handleSubmit}>Create Room</button>
            </div>
        </>
    )
}

export default CreateRoom
