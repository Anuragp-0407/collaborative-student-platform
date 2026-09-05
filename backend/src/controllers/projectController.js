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
        const {
            search,
            category,
            technology,
            skill,
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;

        const query = {
            $expr: {
                $lt: [
                    { $size: "$members" },
                    "$maxTeamSize",
                ],
            },
        };

        // Search
        if (search && search.trim() !== "") {
            query.$or = [
                {
                    title: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    technologies: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    requiredSkills: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
            ];
        }

        // Category filter
        if (category && category.trim() !== "") {
            query.category = {
                $regex: category.trim(),
                $options: "i",
            };
        }

        // Technology filter
        if (technology && technology.trim() !== "") {
            query.technologies = {
                $regex: technology.trim(),
                $options: "i",
            };
        }

        // Skill filter
        if (skill && skill.trim() !== "") {
            query.requiredSkills = {
                $regex: skill.trim(),
                $options: "i",
            };
        }

        // Count matching projects
        const totalProjects = await Project.countDocuments(query);

        // Get projects for current page
        const projects = await Project.find(query)
            .populate("owner", "name email profileImage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalPages = Math.ceil(
            totalProjects / limitNumber
        );

        res.status(200).json({
            success: true,
            count: projects.length,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalProjects,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1,
            },
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

const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user.userId,
        })
            .populate("owner", "name email profileImage")
            .populate("members.user", "name email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error("Get my projects error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getJoinedProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            "members.user": req.user.userId,
            owner: { $ne: req.user.userId },
        })
            .populate("owner", "name email profileImage")
            .populate("members.user", "name email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error("Get joined projects error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this project",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "technologies",
            "requiredSkills",
            "maxTeamSize",
            "githubUrl",
            "demoUrl",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                project[field] = req.body[field];
            }
        });

        await project.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        console.error("Update project error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        if (project.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this project",
            });
        }

        await Project.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error.message);

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
    getMyProjects,
    getJoinedProjects,
    updateProject,
    deleteProject,
};