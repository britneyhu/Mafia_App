import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    function handleCreate() {
        navigate(`/create`);
    }

    function handleJoin() {
        navigate(`/join`);
    }

    return (
        <>
            <button onClick={handleCreate}>Create Room</button>
            <button onClick={handleJoin}>Join Room</button>
        </>
    )
}

export default Home
