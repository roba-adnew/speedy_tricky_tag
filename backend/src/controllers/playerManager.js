const debug = require("debug")("backend:player");

const userData = new Map();

exports.getActiveRoundData = (sessionID) => {
    if (!userData.has(sessionID)) {
        debug("cannot retrieve session data for this user, none exists");
    }

    const gameData = userData.get(sessionID);
    const imageIds = Object.keys(gameData);

    const activeImageId = imageIds.filter(
        (imageId) => gameData[imageId].active
    );

    if (activeImageId.length > 1) {
        debug("there is more than one active round");
        return;
    }
    return gameData[activeImageId[0]];
};

exports.setActiveRound = (sessionID, imageName) => {
    const gameData = userData.get(sessionID);
    if (!gameData) {
        userData.set(sessionID, {
            [imageName]: {
                active: true,
                timerData: {
                    signal: null,
                    time: 0,
                    interval: null,
                },
                riddles: {},
                viewportDetails: null,
            },
        });
        debug('setting new user', userData.get(sessionID))
        return;
    }

    gameData[imageName] = {
        active: true,
        timerData: { signal: null, time: 0, interval: null },
        riddles: {},
        viewportDetails: null,
    };
};

exports.getPlayerData = (sessionID) => {
    debug('user exists in map:', userData.has(sessionID))
    if (!userData.has(sessionID)) {
        debug("no user data for this sessionID");
        return;
    }
    debug('user does have data:', userData.get(sessionID))
    return userData.get(sessionID);
};

exports.deletePlayerData = (sessionID) => {
    if (!userData.has(sessionID)) {
        debug("no user data for this sessionID");
        return;
    }
    return userData.delete(sessionID);
};
