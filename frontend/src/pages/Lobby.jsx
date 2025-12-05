import { useParams } from "react-router-dom";

function Lobby() {
    const { roomCode } = useParams();

    return (
        <>
            Lobby Page

            <div>Room Code: {roomCode}</div>
            <div>
                
            </div>
        </>
    )
}

export default Lobby
