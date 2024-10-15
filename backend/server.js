require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const gamePlayRouter = require("./src/routes/gamePlayRouter");
const scoresRouter = require("./src/routes/scoresRouter");

const prisma = new PrismaClient();
const prismaSession = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // 2 hours in ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
});

const app = express();
app.use(express.json());

const allowedOrigins = [
    "https://speedy-tricky-tag.vercel.app",
    "http://localhost:4000",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(
    session({
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
            sameSite: "none",
            secure: true,
            httpOnly: true,
        },
        secret: process.env.SESSION_SECRET,
        resave: false, // only resave on change
        saveUninitialized: true, // save without being initialized since there is no auth
        store: prismaSession,
    })
);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    next();
});

app.use(cookieParser());
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

app.listen(3000);
