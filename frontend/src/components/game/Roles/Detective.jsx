import Button from "../../Button";

function Doctor({ role, investigatablePlayers, handleDetectiveInvestigate, numReady, alivePlayers, investigationResult, handleDetectiveReady }) {
    return (
        <div className={role === "Detective" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>I am the Detective</div>
            <div>Pick Someone to Investigate</div>

            <div>
                {investigationResult !== "none" && 
                (investigationResult ? "They are Mafia" : "They are Innocent")}</div>
                <Button className={investigationResult !== "none" ? "flex flex-col justify-center items-center" : "hidden"} onClick={handleDetectiveReady}>Continue</Button>

            <ul>
                {investigatablePlayers.map(player => (
                    <div key={player.id}>
                        <Button key={player.id} onClick={()=>handleDetectiveInvestigate(player.name)}>{player.name}</Button>
                    </div>
                ))}
                <Button onClick={()=>handleDetectiveInvestigate("Skip")}>Skip</Button>
            </ul>

            <div>{numReady + "/" + alivePlayers + " Ready"}</div>
        </div>
    )
}

export default Doctor;