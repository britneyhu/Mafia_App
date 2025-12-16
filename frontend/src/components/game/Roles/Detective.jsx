import Button from "../../Button";
import { MdPersonSearch } from "react-icons/md";

function Doctor({ role, investigatablePlayers, handleDetectiveInvestigate, numReady, alivePlayers, investigationResult, handleDetectiveReady }) {
    return (
        <div className={role === "Detective" ? "flex flex-col justify-center items-center gap-10" : "hidden"}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="text-xl">You are the Detective</div>
                <div className="text-xl">Pick Someone to Investigate</div>
            </div>

            <ul className="self-start flex flex-col gap-5">
                {investigatablePlayers.map(player => (
                    <div key={player.id} className="flex justify-center items-center gap-5">
                        <Button key={player.id} onClick={()=>handleDetectiveInvestigate(player.name)} className="w-20">
                            <MdPersonSearch className="size-7"/>
                        </Button>
                        <div className="text-xl">{player.name}</div>
                    </div>
                ))}
            </ul>

            <div className="flex flex-col justify-center items-center gap-2">
                <div>{investigationResult !== "none" && (investigationResult ? "They are Mafia" : "They are Innocent")}</div>
                <Button className={investigationResult !== "none" ? "flex flex-col justify-center items-center" : "hidden"} onClick={handleDetectiveReady}>Continue</Button>
            </div>

            <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                <div>{numReady + "/" + alivePlayers} Ready</div>
            </div>
        </div>
    )
}

export default Doctor;