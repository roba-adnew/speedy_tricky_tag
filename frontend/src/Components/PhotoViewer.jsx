import { useState, useEffect, useRef } from "react";
import {
    getImageDetails as apiGetImage,
    startTimer as apiStartTimer,
    stopTimer as apiStopTimer,
    getTime as apiGetTime,
} from "../utils/api";
import "../Styles/PhotoViewer.css";

function PhotoViewer() {
    const [time, setTime] = useState(0);
    const [successTime, setSuccessTime] = useState(0);
    const [image, setImage] = useState(null);
    const [targets, setTargets] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isTagging, setIsTagging] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);
    const [playerLost, setPlayerLost] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    useEffect(() => {
        async function getFile() {
            const fileObject = await apiGetImage("intersection.jpg");
            setImage(fileObject);
            setTargets(fileObject.details.riddle1.targets);
            setIsLoading(false);
            await apiStartTimer();
            setIsRunning(true);
        }
        if (gameHasStarted) getFile();
    }, [gameHasStarted]);

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
            if (!isRunning) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);

    let scaledTargets;
    if (imageRef?.current && targets) {
        const scalingFactor =
            imageRef.current.height / imageRef.current.naturalHeight;
        scaledTargets = targets.map((target) =>
            target.map((coord) => ({
                x: scalingFactor * (coord.x + imageRef.current.x),
                y: scalingFactor * (coord.y + imageRef.current.y),
            }))
        );
    }

    async function startGame() {
        setIsLoading(true);
        setGameHasStarted(true);
    }

    if (isLoading) {
        return <div>getting the game ready!</div>;
    }

    if (gameHasStarted && !isLoading && !image) {
        return <div>No file data available</div>;
    }

    // const targetOrig = [
    //     [
    //         { x: 1094, y: 1231 },
    //         { x: 1076, y: 2024 },
    //         { x: 2013, y: 1674 },
    //         { x: 2021, y: 2292 },
    //     ],
    //     [
    //         { x: 2238, y: 1676 },
    //         { x: 2393, y: 1684 },
    //         { x: 2232, y: 2525 },
    //         { x: 2401, y: 2524 },
    //     ],
    // ];

    function formattedTime(timeMS) {
        const totalSeconds = timeMS / 1000; // time in API in MS;

        const minutes = Math.floor(totalSeconds / 60);
        const displayMinutes = `${minutes.toString().padStart(2, "0")}`;

        const seconds = (totalSeconds % 60).toFixed(1);
        const displaySeconds = `${seconds.toString().padStart(4, "0")}`;

        const displayTime = `${displayMinutes}:${displaySeconds}`;
        return displayTime;
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

    function validateTag() {
        let isInside = false;
        for (let target of scaledTargets) {
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

    async function handleTagSubmission(e) {
        e.preventDefault();
        console.log("tag submitted");
        if (validateTag()) {
            await apiStopTimer();
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

    if (targets) console.log(scaledTargets)

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
                        src={image.content}
                        alt="Intersection"
                        onClick={tagTarget}
                        ref={imageRef}
                    />
                    {isRunning && <div>{formattedTime(time)}</div>}
                    {playerWon && <div>{formattedTime(successTime)}</div>}
                    {Object.keys(image.details).map((riddle) => {
                        const currentRiddle = image.details[riddle];
                        return (
                            <p
                                key={currentRiddle.answer}
                                onClick={() =>
                                    setTargets(currentRiddle.targets)
                                }
                            >
                                {image.details[riddle].question}
                            </p>
                        );
                    })}
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
