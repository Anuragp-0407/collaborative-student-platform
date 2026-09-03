const mongoose = require("mongoose");
const Project = require("../models/Project");
const Message = require("../models/Message");

const sendMessage = async (req, res) => {
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

        // 2. Validate message
        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty",
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

        // 4. Check project membership
        const isMember = project.members.some(
            (member) => member.user.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Only project members can send messages",
            });
        }

        // 5. Create message
        const newMessage = await Message.create({
            project: projectId,
            sender: userId,
            message: message.trim(),
        });

        // 6. Populate sender information
        await newMessage.populate(
            "sender",
            "name email profileImage"
        );

        // 7. Return message
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error("Send message error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;

        const {
            page = 1,
            limit = 20,
        } = req.query;

        // 1. Validate project ID
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        // 2. Validate pagination values
        const pageNumber = Math.max(parseInt(page) || 1, 1);

        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 20, 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;

        // 3. Find project
        const project = await Project.findById(projectId);

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
                message: "Only project members can view messages",
            });
        }

        // 5. Count total messages
        const totalMessages = await Message.countDocuments({
            project: projectId,
        });

        // 6. Get messages
        const messages = await Message.find({
            project: projectId,
        })
            .populate(
                "sender",
                "name email profileImage"
            )
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limitNumber);

        const totalPages = Math.ceil(
            totalMessages / limitNumber
        );

        // 7. Return response
        return res.status(200).json({
            success: true,
            count: messages.length,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalMessages,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1,
            },
            messages,
        });
    } catch (error) {
        console.error("Get project messages error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    sendMessage,
    getProjectMessages,
};