const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    getCurrentUser,
    updateProfile,
    getDashboardStats,
} = require("../controllers/userController");

const {
    changePassword,
} = require("../controllers/changePasswordController");

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.get("/dashboard", protect, getDashboardStats);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;