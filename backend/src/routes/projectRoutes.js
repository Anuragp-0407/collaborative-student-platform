const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createProject,
    getProjects,
    getProjectById
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);

module.exports = router;