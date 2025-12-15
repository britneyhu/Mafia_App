function Button({children, onClick, className, disabled}) {
    let baseClassName = 
        className + " bg-[#A4F4CF] p-5 rounded-xl " +
        (disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer");
    
    return (
        <button 
            className={baseClassName}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button;