import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getTime as apiGetTime } from "../utils/api";
import { formattedTime } from "../utils/functions";

function Timer({ isRunning }) {
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
            
        </>
    );
}

Timer.propTypes = {
    isRunning: PropTypes.bool,
};

export default Timer;
