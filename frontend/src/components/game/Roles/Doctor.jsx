import Button from "../../Button";

function Doctor({ role, savablePlayers, handleDoctorSave, numReady, alivePlayers }) {
    return (
        <div className={role === "Doctor" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>I am the Doctor</div>
            <div>Pick Someone to Save</div>

            <ul>
                {savablePlayers.map(player => (
                    <div key={player.id}>
                        <Button key={player.id} onClick={()=>handleDoctorSave(player.name)}>{player.name}</Button>
                    </div>
                ))}
                <Button onClick={()=>handleDoctorSave("Skip")}>Skip</Button>
            </ul>

            <div>{numReady + "/" + alivePlayers + " Ready"}</div>
        </div>
    )
}

export default Doctor;