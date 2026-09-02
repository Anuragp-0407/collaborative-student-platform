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

const getProjectJoinRequests = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view these requests",
            });
        }

        const joinRequests = await JoinRequest.find({
            project: projectId,
        })
            .populate("requester", "name email profileImage skills interests")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: joinRequests.length,
            joinRequests,
        });
    } catch (error) {
        console.error("Get join requests error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const acceptJoinRequest = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { requestId } = req.params;

        // 1. Validate request ID
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID",
            });
        }

        let acceptedRequest;

        // 2. Start transaction
        await session.withTransaction(async () => {
            // 3. Find join request
            const joinRequest = await JoinRequest.findById(requestId).session(
                session
            );

            if (!joinRequest) {
                throw new Error("JOIN_REQUEST_NOT_FOUND");
            }

            // 4. Find project
            const project = await Project.findById(
                joinRequest.project
            ).session(session);

            if (!project) {
                throw new Error("PROJECT_NOT_FOUND");
            }

            // 5. Check authorization FIRST
            // Only project owner can accept requests
            if (project.owner.toString() !== req.user.userId) {
                throw new Error("NOT_PROJECT_OWNER");
            }

            // 6. Request must still be pending
            if (joinRequest.status !== "pending") {
                throw new Error("REQUEST_ALREADY_REVIEWED");
            }

            // 7. Defensive check
            // Make sure requester is not already a member
            const isAlreadyMember = project.members.some(
                (member) =>
                    member.user.toString() ===
                    joinRequest.requester.toString()
            );

            if (isAlreadyMember) {
                throw new Error("ALREADY_MEMBER");
            }

            // 8. Check team capacity again
            if (project.members.length >= project.maxTeamSize) {
                throw new Error("TEAM_FULL");
            }

            // 9. Add requester to project members
            project.members.push({
                user: joinRequest.requester,
                role: "Member",
            });

            // 10. Update join request
            joinRequest.status = "accepted";
            joinRequest.reviewedAt = new Date();

            // 11. Save both changes inside transaction
            await project.save({ session });
            await joinRequest.save({ session });

            acceptedRequest = joinRequest;
        });

        // 12. Success response
        return res.status(200).json({
            success: true,
            message: "Join request accepted successfully",
            joinRequest: acceptedRequest,
        });
    } catch (error) {
        console.error("Accept join request error:", error.message);

        // Join request doesn't exist
        if (error.message === "JOIN_REQUEST_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Join request not found",
            });
        }

        // Project doesn't exist
        if (error.message === "PROJECT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // User is not project owner
        if (error.message === "NOT_PROJECT_OWNER") {
            return res.status(403).json({
                success: false,
                message: "Only the project owner can accept requests",
            });
        }

        // Request was already accepted/rejected
        if (error.message === "REQUEST_ALREADY_REVIEWED") {
            return res.status(409).json({
                success: false,
                message: "This request has already been reviewed",
            });
        }

        // Requester already belongs to project
        if (error.message === "ALREADY_MEMBER") {
            return res.status(400).json({
                success: false,
                message: "User is already a project member",
            });
        }

        // Team has reached maximum size
        if (error.message === "TEAM_FULL") {
            return res.status(409).json({
                success: false,
                message: "Project team is already full",
            });
        }

        // Unexpected server error
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    } finally {
        // Always close the MongoDB session
        await session.endSession();
    }
};
module.exports = {
    sendJoinRequest,
    getProjectJoinRequests,
    acceptJoinRequest,
};