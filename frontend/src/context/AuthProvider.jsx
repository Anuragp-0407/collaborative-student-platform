import { useEffect, useState } from "react";

import AuthContext from "./AuthContext";

import {
    login as loginUser,
    register as registerUser,
} from "../services/authService";

import api from "../services/api";

const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("user");
        return null;
    }
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser);

    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/users/me");

                const currentUser = response.data.user;

                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser)
                );

                setUser(currentUser);
                setToken(storedToken);
            } catch (error) {
                console.error(
                    "Session verification failed:",
                    error.message
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const register = async (userData) => {
        const data = await registerUser(userData);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);

        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;