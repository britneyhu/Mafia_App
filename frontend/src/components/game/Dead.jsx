function Dead({ alive, phase }) {

    return(
        <div className={!alive && phase !=="endPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div className="text-2xl font-semibold">You Died</div>
        </div>
    )
}

export default Dead;