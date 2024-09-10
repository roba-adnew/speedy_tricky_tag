import { useState, useEffect } from "react";
import starterImage from "/intersection.jpg";
import "../Styles/PhotoViewer.css";

function PhotoViewer() {
    const [time, setTime] = useState(0);
    const [successTime, setSuccessTime] = useState(0);
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isTagging, setIsTagging] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);
    const [playerLost, setPlayerLost] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });

    const targets = [
        [
            { x: 151, y: 171 },
            { x: 149, y: 278 },
            { x: 276, y: 231 },
            { x: 279, y: 312 },
        ],
        [
            { x: 306, y: 231 },
            { x: 328, y: 233 },
            { x: 306, y: 345 },
            { x: 328, y: 345 },
        ],
    ];

    useEffect(() => {
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
        for (let target of targets) {
            const numEdges = target.length;
            for (let i = 0, j = numEdges - 1; i < numEdges; j = i, i++) {
                const yIsBounded = tag.y < target[i].y !== tag.y < target[j].y;
                const xIsBounded =
                    tag.x <
                    target[i].x +
                        ((tag.y - target[i].y) / (target[j].y - target[i].y)) *
                            (target[j].x - target[i].x);
                console.log(`tag: ${tag.x}, ${tag.y}`, ``);
                console.log(
                    "edge",
                    `c1:(${target[i].x}, ${target[i].y}) 
                    - c2:(${target[j].x}, ${target[j].y})`
                );
                console.log(`y is Bounded: ${yIsBounded}`);
                console.log(`x intercepts: ${xIsBounded}`);
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
