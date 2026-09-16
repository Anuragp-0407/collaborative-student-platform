import api from "./api";

const getCurrentUser = async () => {
    const response = await api.get("/users/me");

    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await api.put(
        "/users/me",
        profileData
    );

    return response.data;
};

export {
    getCurrentUser,
    updateProfile,
};