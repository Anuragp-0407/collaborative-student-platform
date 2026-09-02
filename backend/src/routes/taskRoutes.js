const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createTask } = require("../controllers/taskController");

const router = express.Router();

router.post(
    "/projects/:projectId/tasks",
    protect,
    createTask
);

module.exports = router;