import { Link } from "react-router-dom";

import Button from "./Button";

function Navbar({phase, navRoleVisible, handleNavRoleReveal}) {
    return (
        <nav className="w-full h-25 mb-10 p-5 bg-gray flex items-center justify-between">
            <Link className="text-5xl cursor-pointer" to="/">M</Link>

            <div className={(phase && phase !== "role") ? "flex items-center justify-center gap-5" : "hidden"}>
                <div className="flex flex-col items-center justify-center">
                    <div className="text-lg">Alex</div>
                    <div className={navRoleVisible ? "text-lg" : "hidden"}>Mafia</div>
                </div>
                
                <Button onClick={handleNavRoleReveal} className="bg-linear-295 from-teal to-purple w-30 h-20">{(navRoleVisible ? "Hide Role" : "Reveal Role")}</Button>
            </div>
        </nav>
    )
}

export default Navbar;