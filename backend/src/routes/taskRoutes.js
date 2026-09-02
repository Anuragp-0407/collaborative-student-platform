const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
        createTask,
        getProjectTasks,
        updateTask,
        deleteTask,
 } = require("../controllers/taskController");

const router = express.Router();

router.post(
    "/projects/:projectId/tasks",
    protect,
    createTask
);
router.get(
    "/projects/:projectId/tasks",
    protect,
    getProjectTasks
);

router.put(
    "/tasks/:taskId",
    protect,
    updateTask
);

router.delete(
    "/tasks/:taskId",
    protect,
    deleteTask
);

module.exports = router;