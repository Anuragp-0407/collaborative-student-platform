const User = require("../models/User");

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get current user error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "bio",
            "college",
            "skills",
            "interests",
            "github",
            "linkedin",
            "profileImage",
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update profile error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
module.exports = {
    getCurrentUser,
    updateProfile,
};