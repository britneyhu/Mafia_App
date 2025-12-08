import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
 
import Navbar from "../components/Navbar";
import Button from "../components/Button";

function Game() {
    const { roomCode } = useParams();
    const [role, setRole] = useState("");
    const [roleVisible, setRoleVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        socket.on("roleReveal", (playerRole)=>{
            setRole(playerRole);
        });

        socket.on("errorMessage", (message)=>{
            setErrorMessage(message);
        });

        return ()=>{
            socket.off("roleReveal");
            socket.off("errorMessage");
        }

    }, []);

    function handleRoleReveal() {
        socket.emit("requestRole", roomCode);
        setRoleVisible(true);
    }

    return(
        <>
            <Navbar/>
            <div className="flex flex-col gap-10 items-center mx-5">
                <div className="text-xl">
                    Game Page
                </div>

                <Button onClick={handleRoleReveal}>Reveal My Role</Button>

                <div className={roleVisible ? "flex" : "hidden"}>
                    Your Role is {role}
                </div>

                <div>{errorMessage}</div>
            </div>
            
        </>
    )
}

export default Game;