const { getActiveRoundData } = require("./playerManager");
const debug = require("debug")("backend:timer");

exports.getTime = (req, res, next) => {
    const sessionData = getActiveRoundData(req.sessionID);
    if (!sessionData?.timerData) {
        return res
            .status(400)
            .json({ message: "No timer running for this session" });
    }

    res.json({ time: sessionData.timerData.time });
};

exports.startTimer = (sessionID) => {
    const sessionData = getActiveRoundData(sessionID);
    const updateIntervalMS = 1000;

    if (sessionData.timerData.interval) {
        debug("Timer is already running for this round.");
        return;
    }

    sessionData.timerData.interval = setInterval(() => {
        sessionData.timerData.time += updateIntervalMS;

        if (sessionData.timerData.signal === "stop") {
            clearInterval(sessionData.timerData.interval);
            sessionData.timerData.interval = null;
        }
    }, updateIntervalMS);
};

exports.stopTimer = (sessionID) => {
    const sessionData = getActiveRoundData(sessionID);
    clearInterval(sessionData.timerData.interval);
    sessionData.timerData.interval = null;
};
