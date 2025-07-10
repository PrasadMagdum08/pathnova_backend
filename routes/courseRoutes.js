// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/recommendations", authMiddleware, courseController.course);

module.exports = router;
