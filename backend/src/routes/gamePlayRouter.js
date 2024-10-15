const express = require("express");
const router = express.Router();
const timerController = require("../controllers/timerController");
const gamePlayController = require("../controllers/gamePlayController");

router.get("/image-set", gamePlayController.getImageIds);

router.post("/download", gamePlayController.downloadImage);

router.post("/meta", gamePlayController.getImageMeta);

router.post(
    "/viewport-meta-receiver",
    gamePlayController.receiveViewportDetails
);

router.post("/get-time", timerController.getTime);

router.post("/check-tag", gamePlayController.checkTag);

module.exports = router;
