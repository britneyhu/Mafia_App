import Button from "../Button";

function Role({ handleRoleReveal, roleVisible, role, handleRoleReady, numReady, totalPlayers, phase }) {

    return(
        <div className={phase === "role" ? "flex flex-col justify-center items-center" : "hidden"}>
            <Button onClick={handleRoleReveal}>{(roleVisible ? "Hide My Role" : "Reveal My Role")}</Button>

            <div className={roleVisible ? "flex" : "hidden"}>
                Your Role is {role}
            </div>

            <Button onClick={handleRoleReady}>Ready</Button>

            <div>{numReady + "/" + totalPlayers + " Ready"}</div>
        </div>
    )
}

export default Role;