import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

import Button from "./Button";

function Navbar({phase, navRoleVisible, handleNavRoleReveal, role, name}) {
    return (
        <nav className="w-full h-25 mb-10 p-5 bg-gray flex items-center justify-between">
            <Link className="text-5xl cursor-pointer" to="/">
                <img src={Logo} alt="Logo" className="h-20 w-20" />
            </Link>

            <div className={(phase && phase !== "role") ? "flex items-center justify-center gap-5 p-5" : "hidden"}>
                <div className="flex flex-col items-end justify-center">
                    <div className="text-lg">{name}</div>
                    <div className={navRoleVisible ? "text-lg" : "hidden"}>{role}</div>
                </div>
                
                <Button onClick={handleNavRoleReveal ? handleNavRoleReveal : undefined} className="bg-linear-295 from-teal to-purple w-25 h-15">{(navRoleVisible ? "Hide Role" : "Reveal Role")}</Button>
            </div>
        </nav>
    )
}

export default Navbar;