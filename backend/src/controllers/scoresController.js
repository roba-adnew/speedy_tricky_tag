require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const { getPlayerData, deletePlayerData } = require("./gameDataController");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

exports.getScores = async (req, res, next) => {
    const scores = getMapScores(req.sessionID);
    debug(scores);
    res.json(scores);
};

exports.getScoreBoard = async (req, res, next) => {
    try {
        const scoreboard = await prisma.score.findMany();
        debug('scoreboard:', scoreboard)
        res.json(scoreboard)
    } catch (err) {
        debug('error getting scoreboard: %O', err);
        throw err;
    }
}

exports.submitScore = async (req, res, next) => {
    const { gamerTag } = req.body;
    const scores = getMapScores(req.sessionID);
    try {
        const addScore = await prisma.score.create({
            data: {
                session: { connect: { id: req.sessionID } },
                gamerTag: gamerTag,
                busyBeachTime: scores.times["busy_beach.jpg"],
                intersectionTime: scores.times["intersection.jpg"],
                fleaMarketTime: scores.times["flea_market.jpg"],
                totalTime: scores.finalTime,
                score: scores.score,
            },
        });
        const scoreboard = await prisma.score.findMany();
        const userDeleted = deletePlayerData(req.sessionID);
        debug('user was deleted', userDeleted)
        res.status(201).json({ message: "score was added", scoreboard });
    } catch (err) {
        debug(err);
        throw err;
    }
};

function getMapScores(sessionID) {
    const playerData = getPlayerData(sessionID);
    if (!playerData) return;
    const rounds = Object.keys(playerData);
    const times = {};
    rounds.forEach(
        (round) => (times[round] = playerData[round].timerData.time)
    );

    debug("times", times);
    const zero = 0;
    const finalTime = Object.values(times).reduce(
        (cumm, curr) => cumm + curr,
        zero
    );
    const score = Math.round(98765432198 / finalTime);
    return { times, finalTime, score };
}
