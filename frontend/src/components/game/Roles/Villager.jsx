import Button from "../../Button";
import { TbUserQuestion } from "react-icons/tb";

function Villager({ role, numReady, alivePlayers, handleSurveySubmit, guessablePlayers }) {
    return (
        <div className={role === "Villager" ? "flex flex-col justify-center items-center gap-5" : "hidden"}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="text-xl">You are a Villager</div>
                <div className="text-xl">Who Do You Suspect?</div>
            </div>

            <ul className="self-start flex flex-col gap-5">
                {guessablePlayers.map(player => (
                    <div key={player.id} className="flex justify-center items-center gap-5">
                        <Button key={player.id} onClick={()=>handleSurveySubmit(player.name)} className="w-20">
                            <TbUserQuestion className="size-6"/>
                        </Button>
                        <div className="text-xl">{player.name}</div>
                    </div>
                ))}
                <Button onClick={()=>handleSurveySubmit("Skip")} className="w-20">Skip</Button>
            </ul>

            <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                <div>{numReady + "/" + alivePlayers} Ready</div>
            </div>
        </div>
    )
}

export default Villager;