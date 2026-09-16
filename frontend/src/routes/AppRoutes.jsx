import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateProject from "../pages/CreateProject";
import MyProjects from "../pages/MyProjects";
import ProjectDetails from "../pages/ProjectDetails";
import ProjectTasks from "../pages/ProjectTasks";
import ProjectDiscovery from "../pages/ProjectDiscovery";
import ProjectTeam from "../pages/ProjectTeam";
import ProjectChat from "../pages/ProjectChat";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../hooks/useAuth";

function RootRedirect() {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/projects" element={<MyProjects />} />

          <Route path="/projects/create" element={<CreateProject />} />

          <Route path="/projects/:projectId" element={<ProjectDetails />} />

          <Route path="/projects/:projectId/tasks" element={<ProjectTasks />} />

          <Route path="/discover" element={<ProjectDiscovery />} />

          <Route path="/projects/:projectId/team" element={<ProjectTeam />} />

          <Route path="/projects/:projectId/chat" element={<ProjectChat />} />

          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
