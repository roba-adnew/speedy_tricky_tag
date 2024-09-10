import { useState, useEffect } from "react";
import starterImage from "/intersection.jpg";
import "../Styles/PhotoViewer.css";

function PhotoViewer() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });

    useEffect(() => {
        let interval;
        if (!isRunning) return;
        interval = setInterval(() => setTime((lastTime) => lastTime + 1), 100);
        return () => clearInterval(interval);
    }, [isRunning]);

    function formattedTime() {
        const totalSeconds = time / 10;
        const displayMinutes = Math.floor(totalSeconds / 60);
        const displaySeconds = (totalSeconds % 60).toFixed(1);
        const displayTime = `${displayMinutes.toString().padStart(2, "0")}:
            ${displaySeconds.toString().padStart(4, "0")}`;
        return displayTime;
    }

    function startGame() {
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

    function handleTagSubmission(e) {
        e.preventDefault();
        console.log("tag submitted");
        setIsRunning(false);
        setTime(0);
        toggleTagging();
    }

    return (
        <div style={{ position: "relative" }}>
            {!isRunning ? (
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
                    <div>{formattedTime()}</div>

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
