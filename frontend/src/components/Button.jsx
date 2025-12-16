function Button({children, onClick, className, disabled}) {
    let baseClassName = 
        "bg-[#A4F4CF] p-5 rounded-xl flex justify-center items-center gap-8 bg-gray border-1 border-light-gray " + 
        className +
        (disabled ? " cursor-not-allowed opacity-50" : " cursor-pointer");
    
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