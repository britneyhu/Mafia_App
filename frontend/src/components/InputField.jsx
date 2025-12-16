function InputField({children, value, onChange, className}) {
    const baseClassName = className + " border-1 border-light-gray bg-gray rounded-lg w-70 p-1 px-2"

    return (
        <input 
            className={baseClassName}
            value={value}
            onChange={onChange}
        >
            {children}
        </input>
    )
}

export default InputField;