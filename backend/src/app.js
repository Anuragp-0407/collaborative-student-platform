const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const taskRoutes = require("./routes/taskRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", joinRequestRoutes);
app.use("/api", taskRoutes);
app.use("/api", messageRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Collaborator API is running"
    });
});

module.exports = app;``