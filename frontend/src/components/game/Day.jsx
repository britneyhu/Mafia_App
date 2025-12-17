import Button from "../Button";

function Day({ phase, dayTime, numReady, alivePlayers, handleSkipDay, roundNumber, alive, readyPressed }) {
    function convertTime(dayTime) {
        const minutes = Math.floor(dayTime / 60);
        const seconds = dayTime % 60;
        
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    const readableTime = convertTime(dayTime);

    return(
        <div className={alive && phase === "dayPhase" ? "flex flex-col justify-center items-center gap-20" : "hidden"}>
            <div className="flex flex-col justify-center items-center gap-10">
                <div className="text-2xl font-semibold">Day {roundNumber}</div>
                <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center bg-gray w-60 h-15 text-lg rounded-t-xl">
                        Time Left
                    </div>
                    <div className="flex justify-center items-center w-60 h-30 text-3xl bg-linear-295 from-teal to-purple rounded-b-xl">
                        {readableTime}
                    </div>
                </div>
            </div>

            <div className="flex self-end justify-center items-center gap-5">
                <div>{numReady + "/" + alivePlayers}</div>
                <Button onClick={handleSkipDay} disabled={readyPressed} className={`w-30 ` + (readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>Skip</Button>
            </div>
            
        </div>
    )
}

export default Day;