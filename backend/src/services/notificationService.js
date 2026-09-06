const Notification = require("../models/Notification");

let ioInstance = null;

// Store Socket.IO instance
const initializeNotificationService = (io) => {
    ioInstance = io;
};

const createNotification = async ({
    recipient,
    type,
    title,
    message,
    project = null,
    task = null,
}) => {
    try {
        // Save notification to MongoDB
        const notification = await Notification.create({
            recipient,
            type,
            title,
            message,
            project,
            task,
        });

        // Populate related data before sending to client
        await notification.populate([
            {
                path: "project",
                select: "title",
            },
            {
                path: "task",
                select: "title",
            },
        ]);

        // Send real-time notification
        if (ioInstance) {
            const notificationRoom = `user:${recipient}`;

            ioInstance
                .to(notificationRoom)
                .emit("newNotification", notification);

            console.log(
                `Notification sent to user ${recipient}`
            );
        }

        return notification;
    } catch (error) {
        console.error(
            "Create notification error:",
            error.message
        );

        return null;
    }
};

module.exports = {
    initializeNotificationService,
    createNotification,
};