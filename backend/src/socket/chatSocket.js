const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Project = require("../models/Project");
const Message = require("../models/Message");

const setupChatSocket = (io) => {
    // Socket authentication middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Store authenticated user information
            socket.user = decoded;

            next();
        } catch (error) {
            next(new Error("Invalid or expired token"));
        }
    });

    // Handle Socket.IO connections
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        console.log("User ID:", socket.user.userId);

        // Join project-specific chat room
        socket.on("joinProjectRoom", async (projectId, callback) => {
            try {
                // Validate project ID
                if (!mongoose.Types.ObjectId.isValid(projectId)) {
                    return callback({
                        success: false,
                        message: "Invalid project ID",
                    });
                }

                // Find project
                const project = await Project.findById(projectId);

                if (!project) {
                    return callback({
                        success: false,
                        message: "Project not found",
                    });
                }

                // Check project membership
                const isMember = project.members.some(
                    (member) =>
                        member.user.toString() === socket.user.userId
                );

                if (!isMember) {
                    return callback({
                        success: false,
                        message: "Only project members can join this chat",
                    });
                }

                // Join Socket.IO room
                socket.join(projectId);

                console.log(
                    `User ${socket.user.userId} joined project room ${projectId}`
                );

                callback({
                    success: true,
                    message: "Joined project chat successfully",
                });
            } catch (error) {
                console.error(
                    "Join project room error:",
                    error.message
                );

                callback({
                    success: false,
                    message: "Server error",
                });
            }
        });

        // Send real-time message
        socket.on("sendMessage", async (data, callback) => {
            try {
                const { projectId, message } = data;

                // Validate project ID
                if (!mongoose.Types.ObjectId.isValid(projectId)) {
                    return callback({
                        success: false,
                        message: "Invalid project ID",
                    });
                }

                // Validate message
                if (!message || message.trim() === "") {
                    return callback({
                        success: false,
                        message: "Message cannot be empty",
                    });
                }

                // Find project
                const project = await Project.findById(projectId);

                if (!project) {
                    return callback({
                        success: false,
                        message: "Project not found",
                    });
                }

                // Check project membership
                const isMember = project.members.some(
                    (member) =>
                        member.user.toString() === socket.user.userId
                );

                if (!isMember) {
                    return callback({
                        success: false,
                        message: "Only project members can send messages",
                    });
                }

                // Make sure user has joined the project room
                if (!socket.rooms.has(projectId)) {
                    return callback({
                        success: false,
                        message: "You must join the project chat first",
                    });
                }

                // Save message to MongoDB
                const newMessage = await Message.create({
                    project: projectId,
                    sender: socket.user.userId,
                    message: message.trim(),
                });

                // Populate sender information
                await newMessage.populate(
                    "sender",
                    "name email profileImage"
                );

                // Broadcast message to everyone in the project room
                io.to(projectId).emit(
                    "newMessage",
                    newMessage
                );

                // Confirm successful message creation to sender
                callback({
                    success: true,
                    message: "Message sent successfully",
                    data: newMessage,
                });
            } catch (error) {
                console.error(
                    "Send socket message error:",
                    error.message
                );

                callback({
                    success: false,
                    message: "Server error",
                });
            }
        });

        // Handle socket disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = setupChatSocket;