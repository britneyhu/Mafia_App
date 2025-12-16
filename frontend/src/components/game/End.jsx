import Button from "../Button";
import { GiSpy } from "react-icons/gi";
import { MdGroups } from "react-icons/md";

function End({ phase, winner, handleRestartGame }) {

    return(
        <div className={phase === "endPhase" ? "flex flex-col justify-center items-center gap-5" : "hidden"}>
            <div className="text-4xl font-semibold">{winner} Won</div>

            <div className="flex justify-center items-center w-50 h-50 bg-linear-295 from-teal to-purple rounded-xl">
                <GiSpy className={winner === "Mafia" ? "text-black size-40" : "hidden"}/>
                <MdGroups className={winner !== "Mafia" ? "text-black size-40" : "hidden"}/>
            </div>

            <Button onClick={handleRestartGame}>Play Again</Button>

        </div>
    )
}

export default End;