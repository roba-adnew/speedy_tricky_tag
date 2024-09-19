import { useState, useEffect, useRef } from "react";
import {
    getImageDetails as apiGetImage,
    startTimer as apiStartTimer,
} from "../utils/api";
import Timer from "./Timer";
import "../Styles/PhotoViewer.css";

function PhotoViewer() {
    const [playerCorrect, setPlayerCorrect] = useState(false);
    const [playerWrong, setPlayerWrong] = useState(false);
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [selectedRiddle, setSelectedRiddle] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [riddles, setRiddles] = useState(null);
    const [targets, setTargets] = useState(null);
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    useEffect(() => {
        async function getFile() {
            const fileObject = await apiGetImage("intersection.jpg");
            const imageFile = fileObject.content;
            setImage(imageFile);

            const imageRiddles = fileObject.details;
            Object.keys(imageRiddles).forEach((key) => (imageRiddles[key].answered = false));

            setRiddles(fileObject.details);

            const defaultRiddleTargets = fileObject.details.riddle1.targets;
            setTargets(defaultRiddleTargets);

            setIsLoading(false);
            await apiStartTimer();
            setIsRunning(true);
        }
        if (gameHasStarted) getFile();
    }, [gameHasStarted]);

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
        if (validateTag()) {
            setIsRunning(false);
            setPlayerCorrect(true);
            setPlayerWrong(false);
            toggleTagging();
            return;
        }
        setPlayerWrong(true);
        toggleTagging();
        return;
    }

    function selectRiddle(e) {
        const selectedRiddle = e.target.id;
        console.log(selectedRiddle);
        setTargets(riddles[selectedRiddle].targets);
        setSelectedRiddle(selectedRiddle);
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
                        src={image}
                        alt="Intersection"
                        onClick={tagTarget}
                        ref={imageRef}
                    />
                    <Timer
                        isRunning={isRunning}
                        playerCorrect={playerCorrect}
                    />

                    {Object.keys(riddles).map((riddle) => {
                        return (
                            <p
                                key={riddle}
                                id={riddle}
                                style={{
                                    border:
                                        selectedRiddle === riddle
                                            ? "1px solid blue"
                                            : "none",
                                }}
                                onClick={selectRiddle}
                            >
                                {riddles[riddle].question}
                            </p>
                        );
                    })}

                    {playerWrong && (
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
