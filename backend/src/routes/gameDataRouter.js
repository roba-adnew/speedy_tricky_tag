const express = require("express");
const router = express.Router();
const gameDataController = require("../controllers/gameDataControllers");

router.post("/image-set", gameDataController.getImageIds);

router.post("/download", gameDataController.downloadImage);

router.post("/meta", gameDataController.getImageMeta);

router.post(
    "/viewport-meta-receiver",
    gameDataController.receiveViewportDetails
);

router.post("/start-timer", gameDataController.startTimer);

router.post("/stop-timer", gameDataController.stopTimer);

router.post("/get-time", gameDataController.getTime);

module.exports = router;
