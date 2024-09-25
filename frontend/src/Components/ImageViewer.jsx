import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    getImageDetails as apiGetImage,
    startTimer as apiStartTimer,
    sendViewportDetails as apiSendViewportDetails,
    checkTag as apiCheckTag
} from "../utils/api";
import Timer from "./Timer";
import "../Styles/ImageViewer.css";

function ImageViewer() {
    const [imageIdsIndex, setImageIdIndex] = useState(0);

    const [playerCorrect, setPlayerCorrect] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const [selectedRiddle, setSelectedRiddle] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [riddles, setRiddles] = useState(null);
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const location = useLocation();
    const imageIds = location.state?.imageIds;

    useEffect(() => {});

    useEffect(() => {
        async function getFile() {
            const fileObject = await apiGetImage(imageIds[imageIdsIndex]);
            const imageFile = fileObject.content;
            setImage(imageFile);

            const imageRiddles = fileObject.details;
            Object.keys(imageRiddles).forEach(
                (key) => (imageRiddles[key].answered = false)
            );

            setRiddles(fileObject.details);

            setIsLoading(false);
            await apiStartTimer();
            setIsRunning(true);
        }
        getFile();
    }, [imageIds, imageIdsIndex]);

    useEffect(() => {
        async function sendViewportDetails() {
            if (!imageRef?.current) return;
            const scalingFactor =
                imageRef.current.height / imageRef.current.naturalHeight;
            const xOffset = imageRef.current.x;
            const yOffset = imageRef.current.y;
            const viewportDetails = { scalingFactor, xOffset, yOffset };
            console.log("viewport details:", viewportDetails);
            await apiSendViewportDetails(viewportDetails);
        }
        sendViewportDetails();
    }, [image]);



    if (isLoading) {
        return <div>getting the game ready!</div>;
    }

    if (!isLoading && !image) {
        return <div>No file data available</div>;
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



    async function handleTagSubmission(e) {
        e.preventDefault();
        console.log(riddles[selectedRiddle]);
        console.log('selected riddle at tag:', selectedRiddle),
        console.log('tag at validation', tag);
        const results = await apiCheckTag(selectedRiddle, tag)
        console.log('correctness:', results)
        if (results.correct) {
            const updatedRiddles = {
                ...riddles,
                [selectedRiddle]: {
                    ...riddles[selectedRiddle],
                    answered: true,
                },
            };
            setRiddles(updatedRiddles);
            setPlayerCorrect(true);
            if (results.roundCompleted) {
                setIsRunning(false);
                setPlayerWon(true);
                setImageIdIndex((prevIndex) => prevIndex++);
            };
            toggleTagging();
            return;
        }
        setPlayerCorrect(false);
        toggleTagging();
        return;
    }

    function selectRiddle(e) {
        const selectedRiddle = e.target.id;
        console.log(selectedRiddle);
        setSelectedRiddle(selectedRiddle);
    }

    return (
        <div style={{ position: "relative" }}>
            <img
                className="photo"
                src={image}
                alt="Intersection"
                onClick={tagTarget}
                ref={imageRef}
            />
            <Timer isRunning={isRunning} playerWon={playerWon} />

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
                        onClick={riddles[riddle].answered ? null : selectRiddle}
                    >
                        {riddles[riddle].question}
                    </p>
                );
            })}

            {!playerCorrect && (
                <div>
                    sorry, you got it wrong, but keep going, time is ticking!
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
        </div>
    );
}

export default ImageViewer;
