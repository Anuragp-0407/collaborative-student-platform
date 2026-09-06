const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            unreadOnly,
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 20, 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;

        const query = {
            recipient: req.user.userId,
        };

        // Optional unread filter
        if (unreadOnly === "true") {
            query.read = false;
        }

        const totalNotifications =
            await Notification.countDocuments(query);

        const notifications = await Notification.find(query)
            .populate("project", "title")
            .populate("task", "title")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.userId,
            read: false,
        });

        const totalPages = Math.ceil(
            totalNotifications / limitNumber
        );

        return res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalNotifications,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1,
            },
            notifications,
        });
    } catch (error) {
        console.error(
            "Get my notifications error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Validate notification ID
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
        }

        // Find notification belonging to logged-in user
        const notification = await Notification.findOne({
            _id: notificationId,
            recipient: req.user.userId,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.read = true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    } catch (error) {
        console.error(
            "Mark notification as read error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            {
                recipient: req.user.userId,
                read: false,
            },
            {
                $set: {
                    read: true,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            updatedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error(
            "Mark all notifications as read error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};