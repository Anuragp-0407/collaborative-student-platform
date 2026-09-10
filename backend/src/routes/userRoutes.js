const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getCurrentUser,
    updateProfile,
    getDashboardStats,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.get("/dashboard", protect, getDashboardStats);

router.put("/me", protect, updateProfile);

module.exports = router;