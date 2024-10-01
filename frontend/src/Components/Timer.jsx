import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getTime as apiGetTime } from "../utils/api";

function formattedTime(timeMS) {
    const totalSeconds = timeMS / 1000; // time in API in MS;

    const minutes = Math.floor(totalSeconds / 60);
    const displayMinutes = `${minutes.toString().padStart(1, "0")}`;

    const seconds = Math.floor(totalSeconds % 60);
    const displaySeconds = `${seconds.toString().padStart(2, "0")}`;

    const displayTime = `${displayMinutes}:${displaySeconds}`;
    return displayTime;
}

function Timer({ isRunning, playerWon, successTime }) {
    const [time, setTime] = useState(0);

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
            interval = setInterval(fetchTime, 1000);
        }

        return async () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);

    return (
        <>
            {isRunning && <div>{formattedTime(time)}</div>}
            {playerWon && (
                <div>
                    You got them all right in {formattedTime(successTime)}!
                </div>
            )}
        </>
    );
}

Timer.propTypes = {
    isRunning: PropTypes.bool,
    playerWon: PropTypes.bool,
    successTime: PropTypes.number,
};

export default Timer;
