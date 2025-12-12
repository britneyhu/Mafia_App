import Button from "../Button";

function Day({ phase, dayTime, numReady, alivePlayers, handleSkipDay, roundNumber }) {

    return(
        <div className={phase === "dayPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>Day Phase Round {roundNumber}</div>
            <div>
                Time Left: {dayTime}
            </div>

            <Button onClick={handleSkipDay}>Skip</Button>
            <div>{numReady + "/" + alivePlayers + " Skipped"}</div>
        </div>
    )
}

export default Day;