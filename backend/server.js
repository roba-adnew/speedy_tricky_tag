require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const debug = require("debug")("backend:server");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

// add in routers
const gameDataRouter = require("./src/routes/gameDataRouter");

const allowedOrigins = [
    "https://speedy-tricky-tag.vercel.app",
    "http://localhost:4000",
];

const prisma = new PrismaClient();
const prismaSession = new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // 2 hours in ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
});

const app = express();
app.use(express.json());
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
            sameSite: "lax",
            secure: false,
            httpOnly: true,
        },
        secret: process.env.SESSION_SECRET,
        resave: false, // only resave on change
        saveUninitialized: true, // save without being initialized since there is no auth
        store: prismaSession,
    })
);
app.use(cookieParser());

// add in routers into app
app.use("/images", gameDataRouter);

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
