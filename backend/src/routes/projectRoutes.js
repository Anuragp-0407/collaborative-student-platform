const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createProject,
    getProjects,
    getProjectById,
    getMyProjects,
    getJoinedProjects,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

// User's own projects
router.get("/my-projects", protect, getMyProjects);

// Projects the user has joined
router.get("/joined-projects", protect, getJoinedProjects);

router.get("/:id", protect, getProjectById);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;
module.exports = router;