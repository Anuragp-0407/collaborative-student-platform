import api from "./api";

const getMyNotifications = async (params = {}) => {
    const response = await api.get("/notifications", {
        params,
    });

    return response.data;
};

const markNotificationAsRead = async (notificationId) => {
    const response = await api.put(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};

const markAllNotificationsAsRead = async () => {
    const response = await api.put(
        "/notifications/read-all"
    );

    return response.data;
};

export {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};