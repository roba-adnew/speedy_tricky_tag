require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const session = require("express-session");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

const userData = new Map();

exports.getImageIds = async (req, res, next) => {
    userData.delete(req.sessionID);
    try {
        const imageIds = await prisma.image.findMany({
            select: {
                id: true,
            },
        });

        return res.status(200).json({ imageIds });
    } catch (err) {
        debug("unexpected error getting imageIds", err);
    }
};

exports.downloadImage = async (req, res, next) => {
    debug("imageId download request: %O", req.body.imageId);
    const { imageId } = req.body;

    if (!imageId) {
        return res.status(400).json({ error: "Image name is required" });
    }

    try {
        const results = await prisma.image.findFirst({
            where: { id: imageId },
            select: {
                name: true,
            },
        });

        debug("queried name:", results.name);
        setActiveRound(req.sessionID, results.name);

        const { data, error } = await supabase.storage
            .from("images")
            .download(`public/${results.name}`);

        if (error) {
            debug("Error downloading from Supabase:", error);
            return res.status(500).json({ error: "Failed to download file" });
        }

        const fileBuffer = Buffer.from(await data.arrayBuffer());

        res.setHeader("Content-Type", data.type);
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${results.name}"`
        );

        return res.send(fileBuffer);
    } catch (err) {
        debug("unexpected error getting image", err);
    }
};

exports.getImageMeta = async (req, res, next) => {
    debug("imageId meta request : %O", req.body.imageId);
    const { imageId } = req.body;

    if (!imageId) {
        return res.status(400).json({ error: "Image name is required" });
    }

    try {
        const imageMeta = await prisma.image.findFirst({
            where: { id: imageId },
            select: {
                riddle1: true,
                riddle2: true,
                riddle3: true,
                riddle4: true,
                riddle5: true,
                riddle6: true,
                riddle7: true,
            },
        });

        const sessionData = getActiveRoundData(req.sessionID);

        const clientRiddles = {};
        for (let riddle in imageMeta) {
            sessionData.riddles[riddle] = {
                question: imageMeta[riddle].question,
                targets: imageMeta[riddle].targets,
                answered: false,
            };

            clientRiddles[riddle] = {
                question: imageMeta[riddle].question,
                answered: false,
                tag: null,
            };
        }

        startTimer(req.sessionID);
        return res.json(clientRiddles);
    } catch (err) {
        debug("unexpected error", err);
    }
};

exports.receiveViewportDetails = (req, res, next) => {
    if (!req.body.viewportDetails) {
        res.status(400).json({ message: "details were not received" });
    }
    const roundData = getActiveRoundData(req.sessionID);
    roundData.viewportDetails = req.body.viewportDetails;

    scaleTargets(req.sessionID);
    return res.sendStatus(200);
};

exports.getTime = (req, res, next) => {
    const sessionData = getActiveRoundData(req.sessionID);

    if (!sessionData?.timerData) {
        return res
            .status(400)
            .json({ message: "No timer running for this session" });
    }

    res.json({ time: sessionData.timerData.time });
};

function startTimer(sessionID) {
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
}

function stopTimer(sessionID) {
    const sessionData = getActiveRoundData(sessionID);
    clearInterval(sessionData.timerData.interval);
    sessionData.timerData.interval = null;
}

function scaleTargets(sessionID) {
    const roundData = getActiveRoundData(sessionID);
    const { scalerX: scaler, xOffset, yOffset } = roundData.viewportDetails;
    const riddleKeys = Object.keys(roundData.riddles);
    riddleKeys.forEach((riddle) => {
        roundData.riddles[riddle].scaledTargets = roundData.riddles[
            riddle
        ].targets.map((target) =>
            target.map((coord) => ({
                x: scaler * (coord.x + xOffset),
                y: scaler * (coord.y + yOffset),
            }))
        );
    });
    return;
}

exports.checkTag = (req, res, next) => {
    const { riddle, tag } = req.body;
    const sessionData = getActiveRoundData(req.sessionID);
    const correct = validateTag(req.sessionID, riddle, tag);
    if (correct) sessionData.riddles[riddle].answered = true;
    const roundResults = checkRoundResults(req.sessionID);
    return res
        .status(200)
        .json({ correct: correct, roundResults: roundResults });
};

function validateTag(sessionID, riddle, tag) {
    let isInside = false;
    const sessionData = getActiveRoundData(sessionID);
    const riddleTargets = sessionData.riddles[riddle].scaledTargets;
    debug(
        "targets, riddle and tag mid validation:",
        riddleTargets,
        riddle,
        tag
    );
    for (let target of riddleTargets) {
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
    debug("tag validity:", isInside);
    return isInside;
}

function checkRoundResults(sessionID) {
    const roundResults = { roundCompleted: false, finalTime: null };
    const isCorrect = (flag) => flag === true;
    const sessionData = getActiveRoundData(sessionID);
    const answeredFlags = Object.keys(sessionData.riddles).map(
        (riddle) => sessionData.riddles[riddle].answered
    );
    roundResults.roundCompleted = answeredFlags.every(isCorrect);
    debug("answered flags:", answeredFlags);
    debug("round completed:", roundResults.roundCompleted);

    if (roundResults.roundCompleted) {
        stopTimer(sessionID);
        sessionData.active = false;
        roundResults.finalTime = sessionData.timerData.time;
        debug("final time for this round:", roundResults.finalTime);
    }

    return roundResults;
}

function getActiveRoundData(sessionID) {
    if (!userData.has(`${sessionID}`)) {
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
}

function setActiveRound(sessionID, imageName) {
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
        return;
    }
    gameData[imageName] = {
        active: true,
        timerData: { signal: null, time: 0, interval: null },
        riddles: {},
        viewportDetails: null,
    };
}

exports.getPlayerData = (sessionID) => {
    if (!userData.has(sessionID)) {
        debug("no user data for this sessionID");
        return;
    }
    return userData.get(sessionID);
};

exports.deletePlayerData = (sessionID) => {
    if (!userData.has(sessionID)) {
        debug("no user data for this sessionID");
        return;
    }
    return userData.delete(sessionID);
};
