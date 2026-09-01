const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        profileImage: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            trim: true,
        },

        college: {
            type: String,
            default: "",
            trim: true,
        },

        skills: {
            type: [String],
            default: [],
        },

        interests: {
            type: [String],
            default: [],
        },

        github: {
            type: String,
            default: "",
            trim: true,
        },

        linkedin: {
            type: String,
            default: "",
            trim: true,
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },

        experiencePoints: {
            type: Number,
            default: 0,
            min: 0,
        },

        achievements: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;