import { useEffect, useState } from "react";
import { getFinalScores as apiGetFinalScores } from "../utils/scoresApi";
import { formattedName, formattedTime } from "../utils/functions";

function GameEnd() {
    const [finalScores, setFinalScores] = useState(null);

    useEffect(() => {
        async function getFinalScores() {
            const results = await apiGetFinalScores();
            console.log("scoreboard api returns:", results);
            setFinalScores(results);
        }
        getFinalScores();
    }, []);

    return (
        <div>
            congratulations! you&apos;ve completed the game. Here are your times
            and scores!
            {finalScores &&
                Object.keys(finalScores.times).map((score) => (
                    <div key={score}>
                        <span>{formattedName(score)}:</span>{" "}
                        <span>{formattedTime(finalScores.times[score])}</span>
                    </div>
                ))}
            {finalScores && (
                <>
                    <div>
                        <span>final time:</span>{" "}
                        <span>{formattedTime(finalScores.finalTime)}</span>
                    </div>{" "}
                    <div>
                        <span>score: </span>
                        <span>{finalScores.score}</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default GameEnd;
