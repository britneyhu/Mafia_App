function InputField({children, value, onChange, className}) {
    const baseClassName = className + " border-2 p-4 m-5 h-4"

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