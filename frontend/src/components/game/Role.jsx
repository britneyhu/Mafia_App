import Button from "../Button";
import { GiSpy } from "react-icons/gi";
import { MdGroups } from "react-icons/md";
import { GiPlagueDoctorProfile } from "react-icons/gi";
import { GiSherlockHolmes } from "react-icons/gi";

function Role({ handleRoleReveal, roleVisible, role, handleRoleReady, numReady, alivePlayers, phase }) {

    return(
        <div className={phase === "role" ? "flex flex-col justify-center items-center gap-70 w-full px-5" : "hidden"}>
            <div className="flex flex-col gap-10 justify-center items-center">
                <p className="text-2xl font-semibold">Your Role Is</p>

                <div className={!roleVisible ? "flex flex-col justify-center items-center gap-5" : "hidden"}>
                    <div className="w-50 h-50 bg-gray rounded-xl border-1 border-light-gray"></div>

                    <div className="text-black text-lg">Hidden Text</div>
                </div>
                
                <div className={roleVisible ? "flex flex-col justify-center items-center gap-5" : "hidden"}>
                    <div className="flex justify-center items-center w-50 h-50 bg-linear-295 from-teal to-purple rounded-xl">
                        <GiSpy className={role === "Mafia" ? "text-black size-40" : "hidden"}/>
                        <MdGroups className={role === "Villager" ? "text-black size-40" : "hidden"}/>
                        <GiPlagueDoctorProfile className={role === "Doctor" ? "text-black size-40" : "hidden"}/>
                        <GiSherlockHolmes className={role === "Detective" ? "text-black size-40" : "hidden"}/>
                    </div>

                    <div className="text-lg">{role}</div>
                </div>
                <Button onClick={handleRoleReveal} className="w-30">{(roleVisible ? "Hide" : "Reveal")}</Button>
            </div>

            <div className="flex justify-center items-center gap-5 fixed bottom-0 right-0 p-10">
                <div>{numReady + "/" + alivePlayers}</div>
                <Button onClick={handleRoleReady} className="w-30">Ready</Button>
            </div>
            
        </div>
    )
}

export default Role;