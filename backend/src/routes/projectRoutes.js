const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createProject,
    getProjects,
    getProjectById,
    getMyProjects,
    getJoinedProjects,
    leaveProject,
    removeProjectMember,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", protect, getProjects);

router.get("/my-projects", protect, getMyProjects);

router.get("/joined-projects", protect, getJoinedProjects);

// Leave a project
router.delete(
    "/:projectId/leave",
    protect,
    leaveProject
);
router.delete(
    "/:projectId/members/:userId",
    protect,
    removeProjectMember
);

router.get("/:id", protect, getProjectById);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;