import Button from "../../Button";

function Villager({ role, numReady, alivePlayers, handleSurveySubmit, guessablePlayers }) {
    return (
        <div className={role === "Villager" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>You are a Villager</div>
            <div>Who do you suspect the most right now?</div>

            <ul>
                {guessablePlayers.map(player => (
                    <div key={player.id}>
                        <Button key={player.id} onClick={()=>handleSurveySubmit(player.name)}>{player.name}</Button>
                    </div>
                ))}
            </ul>

            <div>{numReady + "/" + alivePlayers + " Ready"}</div>
        </div>
    )
}

export default Villager;