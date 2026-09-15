import api from "./api";

const createProject = async (projectData) => {
    const response = await api.post("/projects", projectData);

    return response.data;
};

const getProjects = async (params = {}) => {
    const response = await api.get("/projects", {
        params,
    });

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

const sendJoinRequest = async (projectId) => {
    const response = await api.post(
        `/projects/${projectId}/join`,
        {}
    );

    return response.data;
};

const getMyJoinRequests = async () => {
    const response = await api.get("/my/join-requests");

    return response.data;
};

const getProjectTasks = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/tasks`
    );

    return response.data;
};

const getProjectJoinRequests = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/join-requests`
    );

    return response.data;
};

const acceptJoinRequest = async (requestId) => {
    const response = await api.put(
        `/join-requests/${requestId}/accept`
    );

    return response.data;
};

const rejectJoinRequest = async (requestId) => {
    const response = await api.put(
        `/join-requests/${requestId}/reject`
    );

    return response.data;
};
const getProjectMessages = async (projectId, params = {}) => {
    const response = await api.get(
        `/projects/${projectId}/messages`,
        {
            params,
        }
    );

    return response.data;
};

const sendProjectMessage = async (projectId, message) => {
    const response = await api.post(
        `/projects/${projectId}/messages`,
        {
            message,
        }
    );

    return response.data;
};
const getJoinedProjects = async () => {
    const response = await api.get("/projects/joined-projects");

    return response.data;
};
const createTask = async (projectId, taskData) => {
    const response = await api.post(
        `/projects/${projectId}/tasks`,
        taskData
    );

    return response.data;
};
const updateTask = async (taskId, taskData) => {
    const response = await api.put(
        `/tasks/${taskId}`,
        taskData
    );

    return response.data;
};

const deleteTask = async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);

    return response.data;
};
export {
    createProject,
    getProjects,
    getMyProjects,
    getProjectById,
    sendJoinRequest,
    getMyJoinRequests,
    getProjectTasks,
    getProjectJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
    getProjectMessages,
    sendProjectMessage,
    getJoinedProjects,
    createTask,
    updateTask,
    deleteTask,
};