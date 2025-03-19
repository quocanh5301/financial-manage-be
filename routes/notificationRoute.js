const express = require("express");
const router = express.Router();
const notiController = require("../controllers/notificationController");

router.post("/sendToken", notiController.sendToken);

module.exports = router;