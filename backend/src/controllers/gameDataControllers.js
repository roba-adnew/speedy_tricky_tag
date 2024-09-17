require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);
const userTimers = new Map();

exports.downloadImage = async (req, res, next) => {
    debug("image request body: %O", req.body);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Image name is required" });
    }
    try {
        const { data, error } = await supabase.storage
            .from("images")
            .download(`public/${name}`);

        if (error) {
            debug("Error downloading from Supabase:", error);
            return res.status(500).json({ error: "Failed to download file" });
        }

        const fileBuffer = Buffer.from(await data.arrayBuffer());

        debug("sb data raw:%O", data);
        debug("buffer from file object:%O", fileBuffer);
        debug("type:", data.type);

        res.setHeader("Content-Type", data.type);
        res.setHeader("Content-Disposition", `inline; filename="${name}"`);

        return res.send(fileBuffer);
    } catch (err) {
        debug("unexpected error", err);
    }
};

exports.getImageMeta = async (req, res, next) => {
    debug("image request body: %O", req.body);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Image name is required" });
    }

    try {
        const imageMeta = await prisma.image.findFirst({
            where: { name: name },
        });
        debug("prisma results:", imageMeta);

        return res.json(imageMeta);
    } catch (err) {
        debug("unexpected error", err);
    }
};


exports.startTimer = async (req, res, next) => {
    debug("image request body: %O", req.body);
    const userSessionId = req.sessionID;
    debug("starter sessionId:", userSessionId);

    let time = 0;

    if (userTimers.has(userSessionId)) {
        return res
            .status(400)
            .json({ message: "Timer already running for this session" });
    }

    const interval = setInterval(() => {
        time++;
        debug("time:", time);

        const signal = userTimers.get(userSessionId);
        if (signal === "stop") {
            clearInterval(interval);
            userTimers.delete(userSessionId);
        }
    }, 100);

    userTimers.set(userSessionId, { signal: null, time: time });
    return res.status(200).json({ message: "timer set-up" });
};

exports.stopTimer = async (req, res, next) => {
    const userSessionId = req.sessionID;
    const { signal } = req.body;
    debug("stopper sessionId:", userSessionId);

    if (!userTimers.has(userSessionId)) {
        return res.status(400).json({ message: "No timer set for this user" });
    }

    if (signal === "stop") {
        const timerData = userTimers.get(userSessionId)
        timerData.signal = signal;
        userTimers.set(userSessionId, signal);
        return res.status(200).json({ message: "Signal set to stop" });
    }
    return res.status(400).json({ message: "Invalid signal" });
};
