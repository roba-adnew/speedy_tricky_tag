require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

const userTimers = new Map();
const riddles = {};
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

        for (let riddle in imageMeta) {
            riddles[riddle] = {
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
    scaleTargets();
    res.status(201);
};

exports.startTimer = async (req, res, next) => {
    const sessionID = req.sessionID;
    debug("starter sessionId:", sessionID);

    if (userTimers.has(sessionID)) {
        return res
            .status(400)
            .json({ message: "Timer already running for this session" });
    }

    const timerData = { signal: null, time: 0 };

    const interval = setInterval(() => {
        timerData.time += 250;

        if (timerData.signal === "stop") {
            clearInterval(interval);
            userTimers.delete(sessionID);
        }
    }, 250);

    userTimers.set(sessionID, timerData);
    return res.status(200).json({ message: "timer set-up" });
};

exports.stopTimer = async (req, res, next) => {
    const sessionID = req.sessionID;
    const { signal } = req.body;
    debug("stopper sessionId:", sessionID);

    if (!userTimers.has(sessionID)) {
        return res.status(400).json({ message: "No timer set for this user" });
    }

    if (signal === "stop") {
        const timerData = userTimers.get(sessionID);
        timerData.signal = signal;
        return res.status(200).json({ message: "Signal set to stop" });
    }
    return res.status(400).json({ message: "Invalid signal" });
};

exports.getTime = (req, res, next) => {
    const sessionID = req.sessionID;
    if (!userTimers.has(sessionID)) {
        return res
            .status(400)
            .json({ message: "No timer running for this session" });
    }
    const timerData = userTimers.get(sessionID);
    res.json({ time: timerData.time });
};

exports.checkTag = (req, res, next) => {
    const { riddle, tag } = req.body;
    const correct = validateTag(riddle, tag);
    if (correct) riddles[riddle].answered = true;
    const roundCompleted = checkRoundCompleted();
    return res
        .status(200)
        .json({ correct: correct, roundCompleted: roundCompleted });
};

function scaleTargets() {
    const { scalingFactor, xOffset, yOffset } = viewportDetails;
    const riddleKeys = Object.keys(riddles);
    riddleKeys.forEach((riddle) => {
        riddles[riddle].scaledTargets = riddles[riddle].targets.map((target) =>
            target.map((coord) => ({
                x: scalingFactor * (coord.x + xOffset),
                y: scalingFactor * (coord.y + yOffset),
            }))
        );
    });
}

function validateTag(riddle, tag) {
    debug("riddle and tag mid validation:", riddle, tag);
    let isInside = false;
    const riddleTargets = riddles[riddle].scaledTargets;
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

function checkRoundCompleted() {
    const isCorrect = (flag) => flag === true;
    const answeredFlags = Object.keys(riddles).map(
        (riddle) => riddles[riddle].answered
    );
    const roundCompleted = answeredFlags.every(isCorrect);
    debug('answered flags after checking:', answeredFlags)
    return roundCompleted;
}
