function ActionButton({children, onClick, className}) {
    const baseClassName = className + " bg-[#A4F4CF] p-5 m-5 cursor-pointer";
    
    return (
        <button 
            className={baseClassName}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default ActionButton;