import Button from "../../Button";
import { FaGun } from "react-icons/fa6";

function Mafia({ role, killablePlayers, handleMafiaKill, numReady, alivePlayers, readyPressed, killedPlayer }) {
    return (
        <div className={role === "Mafia" ? "flex flex-col justify-center items-center gap-10" : "hidden"}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="text-xl">You are Mafia</div>
                <div className="text-xl">Pick Someone to Kill</div>
            </div>

            <ul className="self-start items-start flex flex-col gap-5">
                {killablePlayers.map(player => (
                    <div key={player.id} className="flex justify-center items-center gap-5">
                        <Button key={player.id} onClick={()=>handleMafiaKill(player.name)} disabled={readyPressed} className={`w-20 ` + (killedPlayer === player.name && readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>
                            <FaGun className="size-7"/>
                        </Button>
                        <div className="text-xl">{player.name}</div>
                    </div>
                ))}
                <Button onClick={()=>handleMafiaKill("Skip")} disabled={readyPressed} className={`w-20 ` + (killedPlayer === "Skip" && readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>Skip</Button>
            </ul>

            <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                <div>{numReady + "/" + alivePlayers} Ready</div>
            </div>
        </div>
    )
}

export default Mafia;