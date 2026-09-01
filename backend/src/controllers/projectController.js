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

module.exports = {
    createProject,
};