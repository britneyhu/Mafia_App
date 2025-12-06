import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="w-full h-20 mb-10 bg-[#BEDBFF] flex items-center">
            <Link 
                className="m-5 p-5 bg-[#8EC6FF] cursor-pointer"
                to="/"
            >
                Home
            </Link>
        </nav>
    )
}

export default Navbar;