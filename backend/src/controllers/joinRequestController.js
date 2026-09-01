const mongoose = require("mongoose");
const Project = require("../models/Project");
const JoinRequest = require("../models/joinRequest");

const sendJoinRequest = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { message } = req.body;

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

        // 3. Check if user is the owner
        if (project.owner.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "Project owner cannot send a join request",
            });
        }

        // 4. Check if user is already a member
        const isMember = project.members.some(
            (member) => member.user.toString() === userId
        );

        if (isMember) {
            return res.status(400).json({
                success: false,
                message: "You are already a member of this project",
            });
        }

        // 5. Check team capacity
        if (project.members.length >= project.maxTeamSize) {
            return res.status(400).json({
                success: false,
                message: "This project team is already full",
            });
        }

        // 6. Check for existing pending request
        const existingRequest = await JoinRequest.findOne({
            project: projectId,
            requester: userId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending request",
            });
        }

        // 7. Create request
        const joinRequest = await JoinRequest.create({
            project: projectId,
            requester: userId,
            message: message || "",
        });

        res.status(201).json({
            success: true,
            message: "Join request sent successfully",
            joinRequest,
        });
    } catch (error) {
        console.error("Send join request error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    sendJoinRequest,
};