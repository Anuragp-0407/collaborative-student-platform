import api from "./api";

const createProject = async (projectData) => {
    const response = await api.post("/projects", projectData);

    return response.data;
};

export { createProject };