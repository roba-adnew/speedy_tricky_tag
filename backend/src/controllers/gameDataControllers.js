require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

const userData = new Map();
let viewportDetails;

exports.getImageIds = async (req, res, next) => {
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
    debug("image request body: %O", req.body.imageId);
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

        const { data, error } = await supabase.storage
            .from("images")
            .download(`public/${results.name}`);

        if (error) {
            debug("Error downloading from Supabase:", error);
            return res.status(500).json({ error: "Failed to download file" });
        }

        const fileBuffer = Buffer.from(await data.arrayBuffer());

        debug("sb data raw:%O", data);
        debug("buffer from file object:%O", fileBuffer);
        debug("type:", data.type);

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
    debug("image request body: %O", req.body);
    const { imageId } = req.body;

    if (!imageId) {
        return res.status(400).json({ error: "Image name is required" });
    }

    try {
        const imageMeta = await prisma.image.findFirst({
            where: { id: imageId.id },
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
        const clientRiddles = {};
        if (!userData.has(req.sessionID)) {
            userData.set(req.sessionID, { riddles: {} });
        }
        const sessionData = userData.get(req.sessionID);
        debug("userData map riddles: %O", sessionData.riddles);

        for (let riddle in imageMeta) {
            sessionData.riddles[riddle] = {
                question: imageMeta[riddle].question,
                targets: imageMeta[riddle].targets,
                answered: false,
            };

            clientRiddles[riddle] = {
                question: imageMeta[riddle].question,
                answered: false,
            };
        }

        return res.json(clientRiddles);
    } catch (err) {
        debug("unexpected error", err);
    }
};

exports.receiveViewportDetails = (req, res, next) => {
    viewportDetails = req.body.viewportDetails;
    debug("viewport:", viewportDetails);
    if (!viewportDetails) {
        res.status(400).json({ message: "details were not received" });
    }
    scaleTargets(req.sessionID);
    res.status(201);
};

exports.startTimer = async (req, res, next) => {
    const sessionID = req.sessionID;
    debug("starter sessionId:", sessionID);

    let sessionData = userData.get(sessionID) || {};

    if (sessionData.timerData) {
        return res
            .status(400)
            .json({ message: "Timer already running for this session" });
    }

    sessionData.timerData = { signal: null, time: 0 };

    const interval = setInterval(() => {
        sessionData.timerData.time += 250;

        if (sessionData.timerData.signal === "stop") {
            clearInterval(interval);
            userData.delete(sessionID);
        }
    }, 250);

    userData.set(sessionID, sessionData);
    return res.status(200).json({ message: "timer set-up" });
};

exports.stopTimer = async (req, res, next) => {
    const sessionID = req.sessionID;
    const { signal } = req.body;
    debug("stopper sessionId:", sessionID);

    const sessionData = userData.get(sessionID);

    if (!sessionData?.timerData) {
        return res.status(400).json({ message: "No timer set for this user" });
    }

    if (signal === "stop") {
        sessionData.timerData.signal = signal;
        return res.status(200).json({ message: "Signal set to stop" });
    }
    return res.status(400).json({ message: "Invalid signal" });
};

exports.getTime = (req, res, next) => {
    const sessionID = req.sessionID;
    const sessionData = userData.get(sessionID);

    if (!sessionData?.timerData) {
        return res
            .status(400)
            .json({ message: "No timer running for this session" });
    }

    res.json({ time: sessionData.timerData.time });
};

exports.checkTag = (req, res, next) => {
    const { riddle, tag } = req.body;
    const sessionData = userData.get(req.sessionID);
    const correct = validateTag(req.sessionID, riddle, tag);
    if (correct) sessionData.riddles[riddle].answered = true;
    const roundCompleted = checkRoundCompleted(req.sessionID);
    return res
        .status(200)
        .json({ correct: correct, roundCompleted: roundCompleted });
};

function scaleTargets(sessionID) {
    const { scalingFactor, xOffset, yOffset } = viewportDetails;
    const sessionData = userData.get(sessionID);
    const riddleKeys = Object.keys(sessionData.riddles);
    riddleKeys.forEach((riddle) => {
        sessionData.riddles[riddle].scaledTargets = sessionData.riddles[riddle].targets.map((target) =>
            target.map((coord) => ({
                x: scalingFactor * (coord.x + xOffset),
                y: scalingFactor * (coord.y + yOffset),
            }))
        );
    });
}

function validateTag(sessionID, riddle, tag) {
    debug("riddle and tag mid validation:", riddle, tag);
    let isInside = false;
    const sessionData = userData.get(sessionID);
    const riddleTargets = sessionData.riddles[riddle].scaledTargets;
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

function checkRoundCompleted(sessionID) {
    const isCorrect = (flag) => flag === true;
    const sessionData = userData.get(sessionID);
    const answeredFlags = Object.keys(sessionData.riddles).map(
        (riddle) => sessionData.riddles[riddle].answered
    );
    const roundCompleted = answeredFlags.every(isCorrect);
    debug("answered flags after checking:", answeredFlags);
    return roundCompleted;
}
