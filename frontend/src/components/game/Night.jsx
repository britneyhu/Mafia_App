function Night({ phase }) {
    return(
        <div className={phase === "nightPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            Night Phase
        </div>
    )
}

export default Night;