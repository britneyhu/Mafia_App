import Button from "../Button";

function Day({ phase, time, numReady, totalPlayers, handleSkipDay }) {

    return(
        <div className={phase === "dayPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            Day Phase
            <div>
                Time Left: {time}
            </div>

            <Button onClick={handleSkipDay}>Skip</Button>
            <div>{numReady + "/" + totalPlayers + " Skipped"}</div>
        </div>
    )
}

export default Day;