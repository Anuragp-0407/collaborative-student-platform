const express = require("express");

const protect = require("../middleware/authMiddleware");
const { createProject } = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, createProject);

module.exports = router;