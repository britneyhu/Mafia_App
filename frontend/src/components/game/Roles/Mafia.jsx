import Button from "../../Button";

function Mafia({ role, killablePlayers, handleMafiaKill, numReady, alivePlayers }) {
    return (
        <div className={role === "Mafia" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>I am Mafia</div>
            <div>Pick Someone to Kill</div>

            <ul>
                {killablePlayers.map(player => (
                    <div key={player.id}>
                        <Button key={player.id} onClick={()=>handleMafiaKill(player.name)}>{player.name}</Button>
                    </div>
                ))}
            </ul>

            <div>{numReady + "/" + alivePlayers + " Ready"}</div>
        </div>
    )
}

export default Mafia;