import { Link } from "react-router-dom";

function LinkButton({children, to, className}) {
    const baseClassName = className + " bg-[#A4F4CF] p-5 m-5 cursor-pointer"
    
    return (
        <Link 
            className={baseClassName}
            to={to}
        >
            {children}
        </Link>
    )
}

export default LinkButton;