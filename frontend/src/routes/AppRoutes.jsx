import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../hooks/useAuth";

function RootRedirect() {
    const { isAuthenticated } = useAuth();

    return (
        <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
        />
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootRedirect />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<RootRedirect />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;