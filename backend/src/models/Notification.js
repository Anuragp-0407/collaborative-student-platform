const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: [
                "join_request",
                "join_request_accepted",
                "join_request_rejected",
                "member_removed",
                "task_assigned",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },

        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },

        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Helps retrieve a user's notifications efficiently
notificationSchema.index({
    recipient: 1,
    createdAt: -1,
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

module.exports = Notification;