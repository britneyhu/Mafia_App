import Button from "../../Button";
import { MdHealthAndSafety } from "react-icons/md";

function Doctor({ role, savablePlayers, handleDoctorSave, numReady, alivePlayers, readyPressed, savedPlayer }) {
    return (
        <div className={role === "Doctor" ? "flex flex-col justify-center items-center gap-10" : "hidden"}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="text-xl">You are the Doctor</div>
                <div className="text-xl">Pick Someone to Save</div>
            </div>

            <ul className="self-start items-start flex flex-col gap-5">
                {savablePlayers.map(player => (
                    <div key={player.id} className="flex justify-center items-center gap-5">
                        <Button key={player.id} onClick={()=>handleDoctorSave(player.name)} disabled={readyPressed} className={`w-20 ` + (savedPlayer === player.name && readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>
                            <MdHealthAndSafety className="size-7"/>
                        </Button>
                        <div className="text-xl">{player.name}</div>
                    </div>
                ))}
                <Button onClick={()=>handleDoctorSave("Skip")} disabled={readyPressed} className={`w-20 ` + (savedPlayer === "Skip" && readyPressed ? "bg-linear-295 from-teal to-purple" : "")}>Skip</Button>
            </ul>

            <div className="flex self-end justify-center items-center gap-5">
                <div>{numReady + "/" + alivePlayers} Ready</div>
            </div>
        </div>
    )
}

export default Doctor;