import { useState, useEffect } from "react";
import { socket } from "../utils/socket.js";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Button from "../components/Button";
import InputField from "../components/InputField.jsx";

function CreateRoom() {
    const navigate = useNavigate();
    const [name, setName] = useState("");

    useEffect(()=>{
        socket.on("roomCreated", (roomCode)=> {
            navigate(`/lobby/${roomCode}`);
        });

        return ()=>{
            socket.off("roomCreated");
        }

    },[navigate])
    
    function handleChange(e) {
        setName(e.target.value);
    }

    function handleSubmit() {
        socket.emit("createRoom", name);
    }
    
    return (
        <>
            <Navbar
                phase={false}
                navRoleVisible={false}
                handleNavRoleReveal={false}
            />
            <div className="flex flex-col gap-10 items-center mx-5">
                <div className="text-xl">
                    Create Room Page
                </div>
                
                <div className="self-start">
                    <div>
                        <label>Name</label>
                        <InputField value={name} onChange={handleChange}/>
                    </div>
                    <Button onClick={handleSubmit}>Create Room</Button>
                </div>
            </div>
            
        </>

    )
}

export default CreateRoom
