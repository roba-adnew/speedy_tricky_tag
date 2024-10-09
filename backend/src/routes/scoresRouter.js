const express = require("express");
const router = express.Router();
const scoresController = require("../controllers/scoresController");

router.post("/get-scores", scoresController.getScores);

module.exports = router;
