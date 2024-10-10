import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    getImageDetails as apiGetImage,
    sendViewportDetails as apiSendViewportDetails,
    checkTag as apiCheckTag,
} from "../utils/gamePlayApi";
import Timer from "./Timer";
import "../Styles/ImageViewer.css";
import { formattedTime } from "../utils/functions";

function ImageViewer() {
    const [imageIdsIndex, setImageIdIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [playerCorrect, setPlayerCorrect] = useState(null);
    const [playerWon, setPlayerWon] = useState(null);
    const [successTime, setSuccessTime] = useState(null);

    const [selectedRiddle, setSelectedRiddle] = useState(null);
    const [image, setImage] = useState(null);
    const [riddles, setRiddles] = useState(null);
    const [isTagging, setIsTagging] = useState(false);
    const [tag, setTag] = useState({ x: 0, y: 0 });
    const [tagFlag, setTagFlag] = useState(false);

    const [vpDetails, setVpDetails] = useState(null);
    const [vpDetailsReady, setVpDetailsReady] = useState(false);

    const imageRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const imageIds = location.state?.imageIds;

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

    useEffect(() => {
        if (imageLoaded && vpDetails) {
            setVpDetailsReady(true);
        }
    }, [imageLoaded, vpDetails]);

    useEffect(() => {
        async function sendViewportDetails() {
            if (vpDetailsReady) {
                try {
                    await apiSendViewportDetails(vpDetails);
                } catch (err) {
                    console.error(err);
                }
            }
        }
        sendViewportDetails();
    }, [vpDetailsReady, vpDetails]);

    function getViewportDetails() {
        if (!imageRef?.current) return;
        const scalerX = imageRef.current.width / imageRef.current.naturalWidth;
        const scalerY =
            imageRef.current.height / imageRef.current.naturalHeight;
        const { x: xOffset, y: yOffset } =
            imageRef.current.getBoundingClientRect();
        const viewportDetails = { scalerX, scalerY, xOffset, yOffset };
        setVpDetails(viewportDetails);
        return viewportDetails;
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
        <div style={{ position: "relative" }}>
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

            {playerWon && (
                <div>ROUND COMPLETE! GETTING THE NEXT ONE READY!</div>
            )}

            {isRunning && playerCorrect === true && (
                <div>NOICE! Got that one right!</div>
            )}

            {isRunning && playerCorrect === false && (
                <div>
                    sorry, you got it wrong, but keep going, time is ticking!
                </div>
            )}

            <Timer isRunning={isRunning} />

            {Object.keys(riddles).map((riddle, i) => {
                return (
                    <div key={riddle}>
                        {riddles[riddle]?.answered && (
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
                                    transform: "translate(-10%, -10%)",
                                    zIndex: 1000,
                                }}
                            >
                                &#10004;{i + 1}
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
