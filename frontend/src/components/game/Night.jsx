import Villager from "./Roles/Villager";
import Mafia from "./Roles/Mafia";
import Doctor from "./Roles/Doctor";
import Detective from "./Roles/Detective";

function Night({ phase, role, numReady, alivePlayers, killablePlayers = [], handleSurveySubmit, handleMafiaKill, killed, roundNumber, skipTime, savablePlayers, handleDoctorSave, investigatablePlayers, handleDetectiveInvestigate, investigationResult, handleDetectiveReady, guessablePlayers }) {
    return(
        <div>
            <div className={phase === "nightPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
                <div>Night Phase Round {roundNumber}</div>

                <Villager
                    role={role}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleSurveySubmit={handleSurveySubmit}
                    guessablePlayers={guessablePlayers}
                />

                <Mafia
                    role={role}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleMafiaKill={handleMafiaKill}
                    killablePlayers={killablePlayers}
                />

                <Doctor
                    role={role}
                    savablePlayers={savablePlayers}
                    handleDoctorSave={handleDoctorSave}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                />

                <Detective
                    role={role}
                    investigatablePlayers={investigatablePlayers}
                    handleDetectiveInvestigate={handleDetectiveInvestigate}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    investigationResult={investigationResult}
                    handleDetectiveReady={handleDetectiveReady}
                />
            </div>

            <div className={phase === "nightResultsPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
                <div>Night Results Phase {roundNumber}</div>
                <div>{killed} Was Killed Last Night</div>
                <div>Advancing in {skipTime}</div>
            </div>

        </div>
    )
}

export default Night;