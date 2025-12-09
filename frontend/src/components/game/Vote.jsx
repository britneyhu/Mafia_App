function Vote({ phase }) {
    return(
        <div className={phase === "votePhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            Vote Phase
        </div>
    )
}


export default Vote;