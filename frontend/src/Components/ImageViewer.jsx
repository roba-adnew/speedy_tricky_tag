import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    getImageDetails as apiGetImage,
    sendViewportDetails as apiSendViewportDetails,
    checkTag as apiCheckTag,
} from "../utils/api";
import Timer from "./Timer";
import "../Styles/ImageViewer.css";

function ImageViewer() {
    const [isLoading, setIsLoading] = useState(true);

    const [imageIdsIndex, setImageIdIndex] = useState(0);

    const [playerCorrect, setPlayerCorrect] = useState(null);
    const [playerWon, setPlayerWon] = useState(null);
    const [successTime, setSuccessTime] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const [selectedRiddle, setSelectedRiddle] = useState(null);
    const [image, setImage] = useState(null);
    const [riddles, setRiddles] = useState(null);
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });
    const [tagFlag, setTagFlag] = useState(false);

    const [vpDetails, setVpDetails] = useState(null);

    const imageRef = useRef(null);
    const location = useLocation();
    const imageIds = location.state?.imageIds;

    useEffect(() => {
        async function getFile() {
            setPlayerCorrect(null);
            setPlayerWon(null);
            const fileObject = await apiGetImage(imageIds[imageIdsIndex]);
            const imageFile = fileObject.content;
            setImage(imageFile);

            const imageRiddles = fileObject.details;
            setRiddles(imageRiddles);

            setIsLoading(false);
            setIsRunning(true);
        }
        getFile();
    }, [imageIds, imageIdsIndex]);

    function getViewportDetails() {
        if (!imageRef?.current) return;
        const scaler = imageRef.current.height / imageRef.current.naturalHeight;
        const { x: xOffset, y: yOffset } =
            imageRef.current.getBoundingClientRect();
        const viewportDetails = { scaler, xOffset, yOffset };
        setVpDetails(viewportDetails);
    }

    useEffect(() => {
        getViewportDetails();
    }, [image]);

    useEffect(() => {
        let resizeTimer;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                getViewportDetails();
            }, 500);
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    console.log("vp details", vpDetails);

    useEffect(() => {
        async function sendViewportDetails() {
            if (!imageRef?.current) return;
            await apiSendViewportDetails(vpDetails);
        }
        sendViewportDetails();
    }, [image, vpDetails]);

    if (isLoading) {
        return <div>getting the game ready!</div>;
    }

    if (!isLoading && !image) {
        return <div>No file data available</div>;
    }

    function selectRiddle(e) {
        const selectedRiddle = e.target.id;
        if (tagFlag) setTagFlag(false);
        setSelectedRiddle(selectedRiddle);
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
        if (!selectedRiddle) {
            setTagFlag(true);
            setIsTagging(false);
            return;
        }
        toggleTagging();
    }

    async function handleTagSubmission(e) {
        e.preventDefault();
        const { correct, roundResults } = await apiCheckTag(
            selectedRiddle,
            tag
        );
        if (correct) {
            const updatedRiddles = {
                ...riddles,
                [selectedRiddle]: {
                    ...riddles[selectedRiddle],
                    answered: true,
                    tag: tag,
                },
            };
            setRiddles(updatedRiddles);
            setSelectedRiddle(null);
            setPlayerCorrect(true);
            toggleTagging();

            if (roundResults.roundCompleted) {
                console.log("won the round!");
                setSuccessTime(roundResults.finalTime);
                setIsRunning(false);
                setPlayerWon(true);
                setImageIdIndex((prevIndex) => prevIndex + 1);
                setPlayerCorrect(false);
            }
            return;
        }
        setPlayerCorrect(false);
        toggleTagging();
        return;
    }

    return (
        <div style={{ position: "relative" }}>
            <img
                className="photo"
                src={image}
                alt="Intersection"
                onClick={tagTarget}
                onLoad={getViewportDetails}
                ref={imageRef}
            />
            {tagFlag && (
                <div
                    className="unselectedTag"
                    style={{
                        border: "1px solid black",
                        backgroundColor: "pink",
                        position: "absolute",
                        left: `${tag.x}px`,
                        top: `${tag.y}px`,
                        transform: "translate(-10%, -10%)",
                        zIndex: 1000,
                    }}
                >
                    You have to select a riddle first
                </div>
            )}

            <Timer
                isRunning={isRunning}
                playerWon={playerWon}
                successTime={successTime}
            />

            {Object.keys(riddles).map((riddle, i) => {
                return (
                    <div key={riddle}>
                        {riddles[riddle]?.answered && (
                            <div
                                key={`${riddle}-answer-marker`}
                                className="correctMarker"
                                style={{
                                    border: "3px solid white",
                                    width: "10px",
                                    borderRadius: "10px",
                                    textAlign: "center",
                                    position: "absolute",
                                    left: `${riddles[riddle]?.tag.x}px`,
                                    top: `${riddles[riddle]?.tag.y}px`,
                                    transform: "translate(-10%, -10%)",
                                    zIndex: 1000,
                                }}
                            >
                                {i + 1}
                            </div>
                        )}
                        <p
                            key={`${riddle}-question`}
                            id={riddle}
                            style={{
                                border: riddles[riddle]?.answered
                                    ? "1px solid green"
                                    : selectedRiddle === riddle
                                    ? "1px solid blue"
                                    : "none",
                            }}
                            onClick={
                                riddles[riddle].answered ? null : selectRiddle
                            }
                        >
                            {`${i + 1}. ${riddles[riddle].question}`}
                        </p>
                    </div>
                );
            })}

            {isRunning && playerCorrect === true && (
                <div>NOICE! Got that one right!</div>
            )}

            {isRunning && playerCorrect === false && (
                <div>
                    sorry, you got it wrong, but keep going, time is ticking!
                </div>
            )}

            {isTagging && !tagFlag && (
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
