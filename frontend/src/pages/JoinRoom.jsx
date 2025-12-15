import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../utils/socket.js";

import Navbar from "../components/Navbar";
import Button from "../components/Button";
import InputField from "../components/InputField.jsx";

function JoinRoom() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket.on("roomJoined", (roomCode) => {
      navigate(`/lobby/${roomCode}`);
    });

    socket.on("errorMessage", (message) => {
      setErrorMessage(message);
    });

    return () => {
      socket.off("roomJoined");
      socket.off("errorMessage");
    };
  }, [navigate]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleCodeChange(e) {
    setCode(e.target.value);
  }

  function handleJoin() {
    const trimmedCode = code.trim();
    socket.emit("joinRoom", { name: name, roomCode: trimmedCode });

    setCode("");
  }

  return (
    <>
      <Navbar
        phase={false}
        navRoleVisible={false}
        handleNavRoleReveal={false}
      />
      <div className="flex flex-col gap-10 justify-center items-center mx-5">
        <div className="text-xl">
            Join Room Page
        </div>
        
        <div className="self-start">
            <div>
                <label>Name</label>
                <InputField value={name} onChange={handleNameChange} />
            </div>

            <div>
                <label>Room Code</label>
                <InputField value={code} onChange={handleCodeChange} />
            </div>

            <Button onClick={handleJoin}>Join</Button>
        </div>

        <p>{errorMessage}</p>
        </div>
    </>
  );
}

export default JoinRoom;
