import { useState, useEffect, useRef } from "react";
import starterImage from "/intersection.jpg";
import "../Styles/PhotoViewer.css";

function PhotoViewer() {
    const [time, setTime] = useState(0); // move to server side
    const [successTime, setSuccessTime] = useState(0); // move to server side
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isTagging, setIsTagging] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);
    const [playerLost, setPlayerLost] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });
    const image = useRef(null);

    const targetOrig = [
        [
            { x: 1094, y: 1231 },
            { x: 1076, y: 2024 },
            { x: 2013, y: 1674 },
            { x: 2021, y: 2292 },
        ],
        [
            { x: 2238, y: 1676 },
            { x: 2393, y: 1684 },
            { x: 2232, y: 2525 },
            { x: 2401, y: 2524 },
        ],
    ];

    let scaledTarget;
    if (image.current) {
        const scalingFactor =
            image.current.height / image.current.naturalHeight;
        scaledTarget = targetOrig.map((target) =>
            target.map((coord) => ({
                x: scalingFactor * (coord.x + image.current.x),
                y: scalingFactor * (coord.y + image.current.y),
            }))
        );
    }

    useEffect(() => {
        // move to server side
        let interval;
        if (!isRunning) return;
        interval = setInterval(() => setTime((lastTime) => lastTime + 1), 100);
        return () => clearInterval(interval);
    }, [isRunning]);

    function formattedTime(time) {
        const totalSeconds = time / 10;

        const minutes = Math.floor(totalSeconds / 60);
        const displayMinutes = `${minutes.toString().padStart(2, "0")}`;

        const seconds = (totalSeconds % 60).toFixed(1);
        const displaySeconds = `${seconds.toString().padStart(4, "0")}`;

        const displayTime = `${displayMinutes}:${displaySeconds}`;
        return displayTime;
    }

    function startGame() {
        setGameHasStarted(true);
        setIsRunning(true);
    }

    function toggleTagging() {
        setIsTagging(!isTagging);
    }

    function tagTarget(e) {
        if (isTagging) return;
        const frame = e.target.getBoundingClientRect();
        const x = e.clientX - frame.left;
        const y = e.clientY - frame.top;
        setTag({ x, y });
        toggleTagging();
    }

    function checkTagIsCorrect() {
        let isInside = false;
        for (let target of scaledTarget) {
            const numEdges = target.length;
            for (let i = 0, j = numEdges - 1; i < numEdges; j = i, i++) {
                const yIsBounded = tag.y < target[i].y !== tag.y < target[j].y;
                const xIsBounded =
                    tag.x <
                    target[i].x +
                        ((tag.y - target[i].y) / (target[j].y - target[i].y)) *
                            (target[j].x - target[i].x);

                const castIntersects = yIsBounded && xIsBounded;
                if (castIntersects) isInside = !isInside;
            }
        }

        return isInside;
    }

    function handleTagSubmission(e) {
        e.preventDefault();
        console.log("tag submitted");
        if (checkTagIsCorrect()) {
            setSuccessTime(time);
            setIsRunning(false);
            setPlayerWon(true);
            setPlayerLost(false);
            toggleTagging();
            return;
        }
        setPlayerLost(true);
        toggleTagging();
        return;
    }

    return (
        <div style={{ position: "relative" }}>
            {!gameHasStarted ? (
                <button type="button" onClick={startGame}>
                    start game
                </button>
            ) : (
                <>
                    <img
                        className="photo"
                        src={starterImage}
                        alt="Intersection"
                        onClick={tagTarget}
                        ref={image}
                    />
                    <div>{formattedTime(time)}</div>
                    {playerWon && (
                        <div>
                            you got it right in {formattedTime(successTime)}!
                        </div>
                    )}
                    {playerLost && (
                        <div>
                            sorry, you got it wrong, but keep going, time is
                            ticking!
                        </div>
                    )}
                    {isTagging && (
                        <form
                            onSubmit={handleTagSubmission}
                            style={{
                                position: "absolute",
                                left: `${tag.x}px`,
                                top: `${tag.y}px`,
                                transform: "translate(-10%, -10%)",
                                zIndex: 1000,
                            }}
                        >
                            <button type="submit">
                                that&apos;s it, tag it! TAG IT NOW!
                            </button>
                            <button onClick={toggleTagging} type="button">
                                ehh, nevermind
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
}

export default PhotoViewer;
