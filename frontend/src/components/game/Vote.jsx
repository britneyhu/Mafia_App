import Button from "../Button";

function Vote({ phase, votablePlayers, numReady, alivePlayers, handleVote, skipResults, votedOff, roundNumber, skipTime, alive }) {
    function convertTime(skipTime) {
        const minutes = Math.floor(skipTime / 60);
        const seconds = skipTime % 60;
        
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    const readableTime = convertTime(skipTime);

    return(
        <div className={alive && phase === "votePhase" || phase === "voteResultsPhase" ? "flex" : "hidden"}>

            <div className={phase === "votePhase" ? "flex flex-col justify-center items-center gap-10" : "hidden"}>
                <div className="flex flex-col justify-center items-center gap-5">
                    <div className="text-2xl font-semibold">Vote {roundNumber}</div>

                    <div className="flex w-full justify-center items-center">
                        <div className="bg-gray border-1 border-light-gray w-35 h-12 flex justify-center items-center text-xl rounded-l-lg">Time Left</div>
                        <div className="bg-linear-295 from-teal to-purple w-35 h-12 flex justify-center items-center text-xl rounded-r-lg">{readableTime}</div>
                    </div>
                </div>
                
                <ul className="self-start flex flex-col gap-5">
                    {votablePlayers.map(player => (
                        <div key={player.id} className="flex justify-center items-center gap-5">
                            <Button key={player.id} onClick={()=>handleVote(player.name)} className="w-20">Vote</Button>
                            <div className="text-xl">{player.name}</div>
                        </div>
                    ))}
                    <Button onClick={()=>handleVote("skip")} className="w-20">Skip</Button>
                </ul>

                <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                    <div>{numReady + "/" + alivePlayers} Ready</div>
                </div>
            </div>

            <div className={phase === "voteResultsPhase" ? "flex flex-col justify-center items-center  gap-10" : "hidden"}>
                <div className="flex flex-col justify-center items-center gap-5">
                    <div className="text-2xl font-semibold">Vote {roundNumber} Results</div>
                    <div className="text-3xl font-semibold">{votedOff} Was Voted Off</div>
                </div>

                <ul className="self-start flex flex-col gap-5">
                    {votablePlayers.map(player => (
                        <div key={player.id} className="flex gap-5 items-center">
                            <div className="text-2xl">{player.name}</div>
                            <div className="flex justify-start items-center p-7 bg-gray border-1 border-light-gray h-10 rounded-lg">
                                Votes:&nbsp;
                                {player.votes.map((vote, index) => (
                                    <div key={index}>
                                        {vote}&nbsp;
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center gap-5">
                        <div className="text-2xl">Skip</div>
                        <div className="flex justify-start items-center p-7 bg-gray border-1 border-light-gray h-10 rounded-lg">
                            {skipResults.map(player => (
                                <div key={player.id} className="flex gap-5 items-center">
                                {player}&nbsp;
                                </div>
                            ))}
                        </div>
                    </div>
                </ul>

                

                <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                    Auto Advance in {skipTime}
                </div>
            </div>   

        </div>
    )
}


export default Vote;