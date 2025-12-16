import Button from "../../Button";
import { FaGun } from "react-icons/fa6";

function Mafia({ role, killablePlayers, handleMafiaKill, numReady, alivePlayers }) {
    return (
        <div className={role === "Mafia" ? "flex flex-col justify-center items-center gap-10" : "hidden"}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="text-xl">You are Mafia</div>
                <div className="text-xl">Pick Someone to Kill</div>
            </div>

            <ul className="self-start flex flex-col gap-5">
                {killablePlayers.map(player => (
                    <div key={player.id} className="flex justify-center items-center gap-5">
                        <Button key={player.id} onClick={()=>handleMafiaKill(player.name)} className="w-20">
                            <FaGun className="size-7"/>
                        </Button>
                        <div className="text-xl">{player.name}</div>
                    </div>
                ))}
                <Button onClick={()=>handleMafiaKill("Skip")} className="w-20">Skip</Button>
            </ul>

            <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                <div>{numReady + "/" + alivePlayers} Ready</div>
            </div>
        </div>
    )
}

export default Mafia;