import { useEffect, useState } from "react";
import {
    getFinalScores as apiGetFinalScores,
    getScoreboard as apiGetScoreboard,
    submitScore as apiSubmitScore,
} from "../utils/scoresApi";
import { formattedName, formattedTime } from "../utils/functions";

function GameEnd() {
    const [finalScores, setFinalScores] = useState(null);
    const [scoreboard, setScoreboard] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [gamerTag, setGamerTag] = useState(null);

    useEffect(() => {
        async function getFinalScores() {
            const results = await apiGetFinalScores();
            setFinalScores(results);
        }
        getFinalScores();
    }, []);

    useEffect(() => {
        async function getScoreboard() {
            const results = await apiGetScoreboard();
            console.log("scoreboard:", results);
            setScoreboard(results);
        }
        getScoreboard();
    }, [submitted]);

    function updateGamerTag(e) {
        setGamerTag(e.target.value);
    }

    async function submitScore(e) {
        e.preventDefault();
        try {
            const successfulSubmission = await apiSubmitScore(gamerTag);
            if (successfulSubmission) {
                console.log("score submitted successfully");
                setSubmitted(true);
            } else {
                console.log("submission failed");
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

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
            {!submitted && (
                <form onSubmit={submitScore}>
                    <label>submit your score </label>
                    <input
                        onChange={updateGamerTag}
                        autoFocus
                        placeholder="yourGamerTag123"
                    ></input>
                    <button>submit</button>
                </form>
            )}
            {scoreboard && (
                <table>
                    <thead>
                        <td>gamer tag</td>
                        <td>score</td>
                        <td>total time</td>
                        <td>busy beach</td>
                        <td>intersection</td>
                        <td>flea market</td>
                    </thead>
                    <tbody>
                        {scoreboard.map(score => {
                            return (
                            <tr key={score.scoreId}>
                                <td>{score.gamerTag}</td>
                                <td>{score.score}</td>
                                <td>{formattedTime(score.totalTime)}</td>
                                <td>{formattedTime(score.busyBeachTime)}</td>
                                <td>{formattedTime(score.intersectionTime)}</td>
                                <td>{formattedTime(score.fleaMarketTime)}</td>
                            </tr>)
                        }) }
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GameEnd;
