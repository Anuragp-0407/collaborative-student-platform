const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

// Get notifications of logged-in user
router.get(
    "/",
    protect,
    getMyNotifications
);

// Mark all notifications as read
router.put(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);

// Mark one notification as read
router.put(
    "/:notificationId/read",
    protect,
    markNotificationAsRead
);

module.exports = router;