import PropTypes from "prop-types";

function SuccessFlag({ isRunning, playerCorrect, playerWon }) {
    return (
        <>
        {playerCorrect === null && (
                <div>Goood luccck</div>
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
        </>
    );
}

SuccessFlag.propTypes = {
    isRunning: PropTypes.bool,
    playerCorrect: PropTypes.bool,
    playerWon: PropTypes.bool,
};

export default SuccessFlag;
