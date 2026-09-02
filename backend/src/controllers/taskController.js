const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate,
        } = req.body;

        // 1. Validate project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // 2. Validate required field
        if (!title || title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        // 3. Find project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const userId = req.user.userId;

        // 4. Check if creator is a project member
        const isMember = project.members.some(
            (member) => member.user.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Only project members can create tasks",
            });
        }

        // 5. If assignedTo is provided, validate the user
        if (assignedTo) {
            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid assigned user ID",
                });
            }

            const isAssignedUserMember = project.members.some(
                (member) => member.user.toString() === assignedTo
            );

            if (!isAssignedUserMember) {
                return res.status(400).json({
                    success: false,
                    message: "Task can only be assigned to a project member",
                });
            }
        }

        // 6. Create task
        const task = await Task.create({
            title: title.trim(),
            description: description || "",
            project: projectId,
            assignedTo: assignedTo || null,
            priority: priority || "medium",
            dueDate: dueDate || null,
        });

        // 7. Return created task
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        console.error("Create task error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        // 1. Validate project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // 2. Find project
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const userId = req.user.userId;

        // 3. Check project membership
        const isMember = project.members.some(
            (member) => member.user.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Only project members can view tasks",
            });
        }

        // 4. Find project tasks
        const tasks = await Task.find({
            project: projectId,
        })
            .populate("assignedTo", "name email profileImage")
            .sort({
                createdAt: -1,
            });

        // 5. Return tasks
        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        console.error("Get project tasks error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        // 1. Validate task ID
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        // 2. Find task
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        // 3. Find related project
        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const userId = req.user.userId;

        // 4. Check project membership
        const isMember = project.members.some(
            (member) => member.user.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Only project members can update tasks",
            });
        }

        const {
            title,
            description,
            assignedTo,
            status,
            priority,
            dueDate,
        } = req.body;

        // 5. Validate title if provided
        if (title !== undefined && title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Task title cannot be empty",
            });
        }

        // 6. Validate assigned user if provided
        if (assignedTo !== undefined && assignedTo !== null) {
            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid assigned user ID",
                });
            }

            const isAssignedUserMember = project.members.some(
                (member) => member.user.toString() === assignedTo
            );

            if (!isAssignedUserMember) {
                return res.status(400).json({
                    success: false,
                    message: "Task can only be assigned to a project member",
                });
            }
        }

        // 7. Update only allowed fields
        if (title !== undefined) {
            task.title = title.trim();
        }

        if (description !== undefined) {
            task.description = description.trim();
        }

        if (assignedTo !== undefined) {
            task.assignedTo = assignedTo;
        }

        if (status !== undefined) {
            task.status = status;
        }

        if (priority !== undefined) {
            task.priority = priority;
        }

        if (dueDate !== undefined) {
            task.dueDate = dueDate;
        }

        // 8. Save with schema validation
        await task.save();

        // 9. Populate assigned user in response
        await task.populate(
            "assignedTo",
            "name email profileImage"
        );

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        console.error("Update task error:", error.message);

        // Mongoose enum/validation errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
module.exports = {
    createTask,
    getProjectTasks,
    updateTask,
};