import Button from "../Button";

function End({ phase, winner, handleRestartGame }) {

    return(
        <div className={phase === "endPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
            End

            <div>
                {winner} Won!
            </div>

            <Button onClick={handleRestartGame}>Play Again</Button>
        </div>
    )
}

export default End;