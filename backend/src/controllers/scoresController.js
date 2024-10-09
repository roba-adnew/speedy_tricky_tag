require("dotenv").config();
const debug = require("debug")("backend:data");
const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
const { getPlayerData } = require("./gameDataController");

const prisma = new PrismaClient();
const supabase = createClient(process.env.SB_API_URL, process.env.SB_API_KEY);

exports.getScores = async (req, res, next) => {
    const playerData = getPlayerData(req.sessionID);
    const rounds = Object.keys(playerData);
    const times = {};
    rounds.forEach(
        (round) => (times[round] = playerData[round].timerData.time)
    );

    const zero = 0;
    const finalTime = Object.values(times).reduce(
        (cumm, curr) => cumm + curr,
        zero
    );
    const score = Math.round(98765432198 / finalTime);
    debug(times, finalTime);
    res.json({ times, finalTime, score });
};
