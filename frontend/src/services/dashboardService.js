import api from "./api";

const getDashboardStats = async () => {
    const response = await api.get("/users/dashboard");

    return response.data;
};

export { getDashboardStats };