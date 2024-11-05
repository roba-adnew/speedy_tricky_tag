import PropTypes from "prop-types";
import "../Styles/RiddleSection.css";

function RiddleSection({ riddles, selectRiddle, selectedRiddle }) {
    return (
        <div>
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
                                    position: "relative",
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
                            className="riddle"
                            key={`${riddle}-question`}
                            id={riddle}
                            style={{
                                border: riddles[riddle]?.answered
                                    ? "1px solid green"
                                    : selectedRiddle === riddle
                                    ? "1px solid blue"
                                    : "none",
                                fontSize:
                                    selectedRiddle === riddle
                                        ? "1rem"
                                        : "0.7rem",
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
        </div>
    );
}

RiddleSection.propTypes = {
    textRef: PropTypes.object,
    riddles: PropTypes.object,
    selectRiddle: PropTypes.func,
    selectedRiddle: PropTypes.string,
};

export default RiddleSection;
