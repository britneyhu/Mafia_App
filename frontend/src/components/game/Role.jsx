import Button from "../Button";

function Role({ handleRoleReveal, roleVisible, role, handleReady, numReady, totalPlayers, visible }) {

    return(
        <div className={visible ? "flex flex-col justify-center items-center" : "hidden"}>
            <Button onClick={handleRoleReveal}>{(roleVisible ? "Hide My Role" : "Reveal My Role")}</Button>

            <div className={roleVisible ? "flex" : "hidden"}>
                Your Role is {role}
            </div>

            <Button onClick={handleReady}>Ready</Button>

            <div>{numReady + "/" + totalPlayers + " Ready"}</div>
        </div>
    )
}

export default Role;