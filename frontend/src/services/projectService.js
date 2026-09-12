import api from "./api";

const createProject = async (projectData) => {
    const response = await api.post("/projects", projectData);

    return response.data;
};

const getMyProjects = async () => {
    const response = await api.get("/projects/my-projects");

    return response.data;
};

const getProjectById = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);

    return response.data;
};

const getProjectTasks = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/tasks`
    );

    return response.data;
};

export {
    createProject,
    getMyProjects,
    getProjectById,
    getProjectTasks,
};