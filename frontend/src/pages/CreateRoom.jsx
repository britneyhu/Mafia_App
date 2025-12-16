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
                role={false}
                name={false}
            />
            <div className="flex flex-col gap-10 justify-center items-center mx-5">       
                    <div className="flex flex-col gap-2">
                        <label>Name</label>
                        <InputField value={name} onChange={handleChange}/>
                    </div>
                    <Button onClick={handleSubmit} className="w-50">Create</Button>
            </div>
            
        </>

    )
}

export default CreateRoom
