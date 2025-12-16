function Button({children, onClick, className, disabled}) {
    let baseClassName = 
        " bg-[#A4F4CF] p-5 rounded-xl flex justify-center items-center gap-8 bg-gray " + 
        " hover:bg-lighter-gray transition-color duration-200 " +
        className +
        (disabled ? " cursor-not-allowed " : " cursor-pointer ");
    
    return (
        <div className="rounded-xl bg-black bg-linear-295 from-teal to-purple p-[1px]">
            <button 
                className={baseClassName}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </button>
        </div>
        
    )
}

export default Button;