import Villager from "./Roles/Villager";
import Mafia from "./Roles/Mafia";
import Doctor from "./Roles/Doctor";
import Detective from "./Roles/Detective";

function Night({ phase, role, numReady, alivePlayers, killablePlayers = [], handleSurveySubmit, handleMafiaKill, killed, roundNumber, skipTime, savablePlayers, handleDoctorSave, investigatablePlayers, handleDetectiveInvestigate, investigationResult, handleDetectiveReady, guessablePlayers, alive }) {
    return(
        <div>
            <div className={alive && phase === "nightPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
                <div className="text-2xl font-semibold pb-10">Night {roundNumber}</div>

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
                <div className="text-4xl font-semibold">{killed}</div>
                <div className="text-4xl font-semibold">Died Last Night</div>
                <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                    Auto Advance in {skipTime}
                </div>
            </div>

        </div>
    )
}

export default Night;