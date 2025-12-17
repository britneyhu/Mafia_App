import Villager from "./Roles/Villager";
import Mafia from "./Roles/Mafia";
import Doctor from "./Roles/Doctor";
import Detective from "./Roles/Detective";

function Night({ 
    phase, role, numReady, alivePlayers, killablePlayers = [], handleSurveySubmit, handleMafiaKill, killed, roundNumber, skipTime, savablePlayers, handleDoctorSave, 
    investigatablePlayers, handleDetectiveInvestigate, investigationResult, handleDetectiveReady, guessablePlayers, alive, readyPressed, guessedPlayer, killedPlayer,
    savedPlayer, investigatedPlayer, detectiveReadyPressed
}) {
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
                    readyPressed={readyPressed}
                    guessedPlayer={guessedPlayer}
                />

                <Mafia
                    role={role}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    handleMafiaKill={handleMafiaKill}
                    killablePlayers={killablePlayers}
                    readyPressed={readyPressed}
                    killedPlayer={killedPlayer}
                />

                <Doctor
                    role={role}
                    savablePlayers={savablePlayers}
                    handleDoctorSave={handleDoctorSave}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    readyPressed={readyPressed}
                    savedPlayer={savedPlayer}
                />

                <Detective
                    role={role}
                    investigatablePlayers={investigatablePlayers}
                    handleDetectiveInvestigate={handleDetectiveInvestigate}
                    numReady={numReady}
                    alivePlayers={alivePlayers}
                    investigationResult={investigationResult}
                    handleDetectiveReady={handleDetectiveReady}
                    readyPressed={readyPressed}
                    investigatedPlayer={investigatedPlayer}
                    detectiveReadyPressed={detectiveReadyPressed}
                />
            </div>

            <div className={alive && phase === "nightResultsPhase" ? "flex flex-col justify-center items-center" : "hidden"}>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="text-4xl font-semibold">{killed}</div>
                    <div className="text-4xl font-semibold">Died Last Night</div>
                </div>
                <div className="flex justify-center items-center gap-5 fixed bottom-15 right-10">
                    Auto Advance in {skipTime}
                </div>
            </div>

        </div>
    )
}

export default Night;