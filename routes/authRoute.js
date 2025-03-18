const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.get("/verifyEmail", authController.verifyEmail);//!fix this
router.post("/login", authController.login);

module.exports = router;