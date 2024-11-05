import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useViewport } from "../hooks/useViewport";
import { useRiddles } from "../hooks/useRiddles";
import {
    getImageDetails as apiGetImage,
    checkTag as apiCheckTag,
} from "../utils/api/gamePlayApi";
import Timer from "./Timer";
// import RiddleSection from "./RiddleSection";
import SuccessFlag from "./SuccessFlag";
import "../Styles/ImageViewer.css";
import { formattedTime } from "../utils/functions";

function ImageViewer() {
    const [image, setImage] = useState(null);
    const [imageIdsIndex, setImageIdIndex] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [playerCorrect, setPlayerCorrect] = useState(null);
    const [playerWon, setPlayerWon] = useState(null);
    const [successTime, setSuccessTime] = useState(null);

    const [riddles, setRiddles] = useState(null);
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });

    const location = useLocation();
    const navigate = useNavigate();
    const imageIds = location.state?.imageIds;

    const {
        imageRef,
        containerRef,
        textRef,
        getViewportDetails,
        setImageLoaded,
    } = useViewport();
    const {
        selectRiddle,
        selectedRiddle,
        setSelectedRiddle,
        tagFlag,
        setTagFlag,
    } = useRiddles();

    useEffect(() => {
        async function getRoundMeta() {
            setIsLoading(true);
            const fileObject = await apiGetImage(imageIds[imageIdsIndex]);
            const imageFile = fileObject.content;
            const imageRiddles = fileObject.details;
            setImage(imageFile);
            setRiddles(imageRiddles);

            setIsLoading(false);
            setIsRunning(true);
            setPlayerCorrect(null);
            setPlayerWon(null);
        }
        getRoundMeta();
    }, [imageIds, imageIdsIndex]);

    function toggleTagging() {
        setIsTagging(!isTagging);
    }

    function tagTarget(e) {
        if (isTagging) return;
        const x = e.clientX;
        const y = e.clientY;
        console.log("tag:", x, y)
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
            console.log("correct tag:", tag);
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

            if (roundResults.roundCompleted) {
                setSuccessTime(roundResults.finalTime);
                setIsRunning(false);
                setPlayerWon(true);
                if (imageIdsIndex === imageIds.length - 1) {
                    navigate("/scoreboard");
                }
                setImageIdIndex((prevIndex) => prevIndex + 1);
            }
            toggleTagging();

            return;
        }
        setPlayerCorrect(false);
        toggleTagging();
        return;
    }

    if (isLoading && !playerWon) {
        return <div>getting the game ready!</div>;
    }

    if (isLoading && playerWon) {
        return (
            <div>
                Well done, you finished the last round in{" "}
                {formattedTime(successTime)}! getting the next round ready
            </div>
        );
    }

    if (!isLoading && !image) {
        return (
            <div>
                ther&apos;s been an issue, please go back to the home page and
                try starting the game again
            </div>
        );
    }
    return (
        <div className="game" style={{ position: "relative" }}>
            <div className="imageContainer" ref={containerRef}>
                <img
                    className="photo"
                    src={image}
                    alt="Intersection"
                    onClick={tagTarget}
                    onLoad={() => {
                        getViewportDetails();
                        setImageLoaded(true);
                    }}
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
                {Object.keys(riddles).map(
                    (riddle, i) =>
                        riddles[riddle]?.answered && (
                            <div
                                key={`${riddle}-answer-marker`}
                                className="correctMarker"
                                style={{
                                    border: "2px solid white",
                                    width: "25px",
                                    borderRadius: "10px",
                                    textAlign: "center",
                                    position: "absolute",
                                    left: `${riddles[riddle]?.tag.x}px`,
                                    top: `${riddles[riddle]?.tag.y}px`,
                                    zIndex: 1000,
                                }}
                            >
                                &#10004;{i + 1}
                            </div>
                        )
                )}
            </div>

            <div className="riddles" ref={textRef}>
                <SuccessFlag
                    isRunning={isRunning}
                    playerCorrect={playerCorrect}
                    playerWon={playerWon}
                />

                <Timer isRunning={isRunning} />

                <div>
                    {Object.keys(riddles).map((riddle, i) => {
                        return (
                            <div key={riddle}>
                                <p
                                    className="riddle"
                                    key={`${riddle}-question`}
                                    id={riddle}
                                    style={{
                                        border: riddles[riddle]?.answered
                                            ? "2px solid green"
                                            : selectedRiddle === riddle
                                            ? "2px solid blue"
                                            : "2px solid rgb(220, 220, 220)",
                                        margin: "0rem",
                                        padding: "0.2rem"
                                    }}
                                    onClick={
                                        riddles[riddle].answered
                                            ? null
                                            : selectRiddle
                                    }
                                >
                                    {`${i + 1}. ${riddles[riddle].question}`}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ImageViewer;

{
    /* 
                <RiddleSection
                    riddles={riddles}
                    selectRiddle={selectRiddle}
                    selectedRiddle={selectedRiddle}
                /> */
}

{
    /* {riddles[riddle]?.answered && (
                                    <div
                                        key={`${riddle}-answer-marker`}
                                        className="correctMarker"
                                        style={{
                                            border: "2px solid white",
                                            width: "25px",
                                            borderRadius: "10px",
                                            textAlign: "center",
                                            position: "relative",
                                            left: `${riddles[riddle]?.tag.x}px`,
                                            top: `${riddles[riddle]?.tag.y}px`,
                                            transform: "translate(-10%, -10%)",
                                            zIndex: 1000,
                                        }}
                                    >
                                        &#10004;{i + 1}
                                    </div>
                                )} */
}
