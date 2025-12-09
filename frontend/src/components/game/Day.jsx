import Button from "../Button";

function Day({ visible }) {

    return(
        <div className={visible ? "flex flex-col justify-center items-center" : "hidden"}>
            Day Phase
        </div>
    )
}

export default Day;