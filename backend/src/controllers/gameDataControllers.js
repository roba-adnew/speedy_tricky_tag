require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);
const userTimers = new Map();

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
        debug("prisma results:", imageMeta);

        return res.json(imageMeta);
    } catch (err) {
        debug("unexpected error", err);
    }
};

exports.startTimer = async (req, res, next) => {
    debug("image request body: %O", req.body);
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
    debug("time: ", timerData.time);

    res.json({ time: timerData.time });
};
