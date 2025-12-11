import Button from "../Button";

function Day({ phase, time, numReady, alivePlayers, handleSkipDay }) {

    return(
        <div className={phase === "dayPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            Day Phase
            <div>
                Time Left: {time}
            </div>

            <Button onClick={handleSkipDay}>Skip</Button>
            <div>{numReady + "/" + alivePlayers + " Skipped"}</div>
        </div>
    )
}

export default Day;