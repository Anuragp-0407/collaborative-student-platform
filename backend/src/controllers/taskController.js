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

module.exports = {
    createTask,
};