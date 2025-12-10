import Button from "../../Button";

function Villager({ role, numReady, totalPlayers, handleSurveySubmit }) {
    return (
        <div className={role === "Villager" ? "flex flex-col justify-center items-center" : "hidden"}>
            <div>You are a Villager</div>
            <div>Please take this survey!</div>

            <Button onClick={()=>handleSurveySubmit("Beef")}>Beef</Button>
            <Button onClick={()=>handleSurveySubmit("Chicken")}>Chicken</Button>
            <Button onClick={()=>handleSurveySubmit("Pork")}>Pork</Button>
            <Button onClick={()=>handleSurveySubmit("Lamb")}>Lamb</Button>

            <div>{numReady + "/" + totalPlayers + " Ready"}</div>
        </div>
    )
}

export default Villager;