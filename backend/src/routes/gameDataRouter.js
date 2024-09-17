const express = require("express");
const router = express.Router();
const gameDataController = require("../controllers/gameDataControllers");

router.post("/download", gameDataController.downloadImage);

router.post("/meta", gameDataController.getImageMeta);

router.post("/timer", gameDataController.startTimer);

router.post("/stop-timer", gameDataController.stopTimer);

module.exports = router;
