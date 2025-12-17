import Button from "../../Button";
import { TbUserQuestion } from "react-icons/tb";

function Villager({ role, numReady, alivePlayers, handleSurveySubmit, guessablePlayers, readyPressed, guessedPlayer }) {
    return (
        <div className={role === "Villager" ? "flex flex-col justify-center items-center gap-10" : "hidden"}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="text-xl">You are a Villager</div>
                <div className="text-xl">Who Do You Suspect?</div>
            </div>

            <ul className="self-start items-start flex flex-col gap-5">
                {guessablePlayers.map(player => (
                    <div key={player.id} className="flex justify-center items-center gap-5">
                        <Button key={player.id} onClick={()=>handleSurveySubmit(player.name)} disabled={readyPressed} className={`w-20 ` + (guessedPlayer === player.name && readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>
                            <TbUserQuestion className="size-6"/>
                        </Button>
                        <div className="text-xl">{player.name}</div>
                    </div>
                ))}
                <Button onClick={()=>handleSurveySubmit("Skip")} disabled={readyPressed} className={`w-20 ` + (guessedPlayer === "Skip" && readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>Skip</Button>
            </ul>

            <div className="flex self-end justify-center items-center gap-5">
                <div>{numReady + "/" + alivePlayers} Ready</div>
            </div>
        </div>
    )
}

export default Villager;