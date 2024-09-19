import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { stopTimer as apiStopTimer, getTime as apiGetTime } from "../utils/api";

function formattedTime(timeMS) {
    const totalSeconds = timeMS / 1000; // time in API in MS;

    const minutes = Math.floor(totalSeconds / 60);
    const displayMinutes = `${minutes.toString().padStart(2, "0")}`;

    const seconds = (totalSeconds % 60).toFixed(1);
    const displaySeconds = `${seconds.toString().padStart(4, "0")}`;

    const displayTime = `${displayMinutes}:${displaySeconds}`;
    return displayTime;
}

function Timer({ isRunning, playerCorrect }) {
    const [time, setTime] = useState(0);
    const [successTime, setSuccessTime] = useState(0);

    useEffect(() => {
        async function fetchTime() {
            try {
                const time = await apiGetTime();
                setTime(time);
            } catch (err) {
                console.error(err);
            }
        }

        let interval;
        if (isRunning) {
            fetchTime();
            interval = setInterval(fetchTime, 100);
        }

        return async () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        async function stopRound() {
            await apiStopTimer();
            setSuccessTime(time);
        }
        if (playerCorrect) stopRound();
    }, [time, playerCorrect]);


    return (
        <>
            {isRunning && <div>{formattedTime(time)}</div>}
            {playerCorrect && (
                <div>you got it right in {formattedTime(successTime)}!</div>
            )}
        </>
    );
}

Timer.propTypes = {
    isRunning: PropTypes.bool,
    playerCorrect: PropTypes.bool,
};

export default Timer;
