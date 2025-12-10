import Button from "../Button";

function End({ phase, winner }) {

    return(
        <div className={phase === "endPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            End

            <div>
                {winner} Won!
            </div>
        </div>
    )
}

export default End;