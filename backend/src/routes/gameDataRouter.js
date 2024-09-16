const express = require("express");
const router = express.Router();
const gameDataController = require("../controllers/gameDataControllers");

router.post("/download", gameDataController.getImage);

module.exports = router;
