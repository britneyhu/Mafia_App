import Button from "../Button";

function Vote({ phase, votablePlayers, numReady, alivePlayers, handleVote, skipResults, votedOff, roundNumber, skipTime }) {
    return(
        <div className={phase === "votePhase" || phase === "voteResultsPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>Vote Phase Round {roundNumber}</div>

            <div className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                {votedOff} Has Been Voted Off
            </div>

            <ul>
                {votablePlayers.map(player => (
                    <div key={player.id}>
                        <Button key={player.id} onClick={()=>handleVote(player.name)}>{player.name}</Button>
                        {player.votes.map((vote, index) => (
                            <div key={index} className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                                Votes: {vote},
                            </div>
                        ))}
                    </div>
                ))}
            </ul>

            <Button onClick={()=>handleVote("skip")} value="skip">Skip</Button>

            <div className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                {skipResults}
            </div>

            <div className={phase === "votePhase" ? "flex" : "hidden"}>{numReady + "/" + alivePlayers + " Ready"}</div>

            <div className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                Advancing in {skipTime}
            </div>

        </div>
    )
}


export default Vote;