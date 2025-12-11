import Villager from "./Roles/Villager";
import Mafia from "./Roles/Mafia";

function Night({ phase, role, numReady, alivePlayers, killablePlayers = [], handleSurveySubmit, handleMafiaKill, killed }) {
    return(
        <div>
            <div className={phase === "nightPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
                <div>Night Phase</div>

                <Villager
                    role={role}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleSurveySubmit={handleSurveySubmit}
                />

                <Mafia
                    role={role}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleMafiaKill={handleMafiaKill}
                    killablePlayers={killablePlayers}
                />
            </div>

            <div className={phase === "nightResultsPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
                <div>Night Results Phase</div>
                <div>{killed} Was Killed Last Night</div>
            </div>

        </div>
    )
}

export default Night;