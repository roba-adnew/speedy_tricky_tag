const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scoresController");

router.post("/get-scores", scoresController.getScores);

router.post("/submit", scoresController.submitScore);

router.post("/scoreboard", scoresController.getScoreBoard)

module.exports = router;
