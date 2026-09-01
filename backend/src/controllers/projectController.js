const mongoose = require("mongoose");
const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            technologies,
            requiredSkills,
            maxTeamSize,
            githubUrl,
            demoUrl,
        } = req.body;

        // Basic validation
        if (!title || !description || !category || !maxTeamSize) {
            return res.status(400).json({
                success: false,
                message: "Title, description, category and maxTeamSize are required",
            });
        }

        const project = await Project.create({
            title,
            description,
            category,
            technologies: technologies || [],
            requiredSkills: requiredSkills || [],
            maxTeamSize,
            githubUrl: githubUrl || "",
            demoUrl: demoUrl || "",

            owner: req.user.userId,

            members: [
                {
                    user: req.user.userId,
                    role: "Team Lead",
                },
            ],
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        console.error("Create project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("owner", "name email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error("Get projects error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(id)
            .populate("owner", "name email profileImage")
            .populate("members.user", "name email profileImage");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Get project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
};