require("dotenv").config();
const debug = require("debug")("backend:server");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const gamePlayRouter = require("../src/routes/gamePlayRouter");
const scoresRouter = require("../src/routes/scoresRouter");

const prisma = new PrismaClient();
const prismaSession = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // 2 hours in ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
});

const app = express();
const allowedOrigins = ["http://localhost:4000"];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());
debug("env:", process.env.NODE_ENV)
app.use(
    session({
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        },
        secret: process.env.SESSION_SECRET,
        resave: false, // only resave on change
        saveUninitialized: true, // save without being initialized since there is no auth
        store: prismaSession,
    })
);

app.use("/game", gamePlayRouter);
app.use("/scores", scoresRouter);

app.get("/", (req, res, next) => {
    res.send("<h1>we made it</h1>");
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    console.error(err.stack);
    res.status(500).json({
        message: "An error occurred",
        error:
            process.env.NODE_ENV === "DEV"
                ? err.message
                : "Internal server error",
    });
});

if (process.env.NODE_ENV === "DEV") {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}

module.exports = app;
