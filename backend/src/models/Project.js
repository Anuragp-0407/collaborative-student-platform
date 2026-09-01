const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            trim: true,
            default: "Member",
        },
    },
    { _id: false }
);

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        technologies: {
            type: [String],
            default: [],
        },

        requiredSkills: {
            type: [String],
            default: [],
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        members: {
            type: [projectMemberSchema],
            default: [],
        },

        maxTeamSize: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
        },

        status: {
            type: String,
            enum: ["planning", "active", "completed", "cancelled"],
            default: "planning",
        },

        githubUrl: {
            type: String,
            default: "",
            trim: true,
        },

        demoUrl: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;