const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    getCurrentUser,
    updateProfile,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.put("/me", protect, updateProfile);

module.exports = router;