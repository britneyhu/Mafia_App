import Button from "../Button";

function Vote({ phase, alivePlayers, numReady, totalPlayers, handleVote, skipResults, handleVoteReady, killed }) {
    return(
        <div className={phase === "votePhase" || phase === "voteResultsPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            Vote Phase

            <div className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                {killed} Has Been Voted Off
            </div>

            <ul>
                {alivePlayers.map(player => (
                    <>
                        <Button key={player.id} onClick={()=>handleVote(player.name)}>{player.name}</Button>
                        {player.votes.map((vote, index) => (
                            <div key={index} className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                                Votes: {vote},
                            </div>
                        ))}
                    </>
                ))}
            </ul>

            <Button onClick={()=>handleVote("skip")} value="skip">Skip</Button>

            <div className={phase === "voteResultsPhase" ? "flex" : "hidden"}>
                {skipResults}
            </div>

            <div className={phase === "votePhase" ? "flex" : "hidden"}>{numReady + "/" + totalPlayers + " Ready"}</div>
        
            <Button className={phase === "voteResultsPhase" ? "flex" : "hidden"} onClick={handleVoteReady}>Next</Button>
            <div className={phase === "voteResultsPhase" ? "flex" : "hidden"}>{numReady + "/" + totalPlayers + " Ready"}</div>
        </div>
    )
}


export default Vote;