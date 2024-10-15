const express = require("express");
const router = express.Router();
const timerController = require("../controllers/timerController");
const gameDataController = require("../controllers/gameDataController");

router.post("/image-set", gameDataController.getImageIds);

router.post("/download", gameDataController.downloadImage);

router.post("/meta", gameDataController.getImageMeta);

router.post(
    "/viewport-meta-receiver",
    gameDataController.receiveViewportDetails
);

router.post("/get-time", timerController.getTime);

router.post("/check-tag", gameDataController.checkTag);

module.exports = router;
