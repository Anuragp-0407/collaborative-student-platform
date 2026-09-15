import { useEffect, useState } from "react";

import {
    Activity,
    ArrowRight,
    CheckSquare,
    FolderKanban,
    Plus,
    Search,
    Users,
    Bell,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";

import useAuth from "../hooks/useAuth";

import {
    getDashboardStats,
} from "../services/dashboardService";

import {
    getMyProjects,
    getJoinedProjects,
} from "../services/projectService";

const Dashboard = () => {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        myProjects: 0,
        joinedProjects: 0,
        myTasks: 0,
        experiencePoints: 0,
    });

    const [myProjects, setMyProjects] = useState([]);
    const [joinedProjects, setJoinedProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setProjectsLoading(true);
                setError("");

                const [
                    statsResponse,
                    myProjectsResponse,
                    joinedProjectsResponse,
                ] = await Promise.all([
                    getDashboardStats(),
                    getMyProjects(),
                    getJoinedProjects(),
                ]);

                setStats(
                    statsResponse?.stats || {
                        myProjects: 0,
                        joinedProjects: 0,
                        myTasks: 0,
                        experiencePoints: 0,
                    }
                );

                setMyProjects(
                    myProjectsResponse?.projects ||
                        myProjectsResponse?.data ||
                        []
                );

                setJoinedProjects(
                    joinedProjectsResponse?.projects ||
                        joinedProjectsResponse?.data ||
                        []
                );
            } catch (error) {
                console.error(
                    "Failed to load dashboard:",
                    error.message
                );

                setError(
                    "Unable to load your workspace data."
                );
            } finally {
                setLoading(false);
                setProjectsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const openMyProjects = () => {
        navigate("/projects");
    };

    const openDiscover = () => {
        navigate("/discover");
    };

    const openProject = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const getProjectStatusClass = (status) => {
        switch (status) {
            case "active":
                return "border-emerald-400/15 bg-emerald-500/[0.06] text-emerald-300";

            case "completed":
                return "border-cyan-400/15 bg-cyan-500/[0.06] text-cyan-300";

            case "cancelled":
                return "border-red-400/15 bg-red-500/[0.06] text-red-300";

            default:
                return "border-amber-400/15 bg-amber-500/[0.06] text-amber-300";
        }
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Planning";
        }

        return status
            .split("-")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");
    };

    const ProjectCard = ({ project }) => {
        const projectId = project?._id || project?.id;

        return (
            <button
                type="button"
                onClick={() => openProject(projectId)}
                className="group w-full cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.035]"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-white/80 transition-colors group-hover:text-violet-300">
                            {project?.title || "Untitled Project"}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/30">
                            {project?.description ||
                                "No project description available."}
                        </p>
                    </div>

                    <ArrowRight
                        size={15}
                        className="mt-1 shrink-0 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-300"
                    />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${getProjectStatusClass(
                            project?.status
                        )}`}
                    >
                        {formatStatus(project?.status)}
                    </span>

                    {project?.category && (
                        <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] font-semibold text-white/30">
                            {project.category}
                        </span>
                    )}

                    <span className="ml-auto flex items-center gap-1 text-[10px] text-white/25">
                        <Users size={12} />

                        {project?.members?.length || 0}
                        {project?.maxTeamSize
                            ? `/${project.maxTeamSize}`
                            : ""}
                    </span>
                </div>
            </button>
        );
    };

    const ProjectSection = ({
        title,
        label,
        projects,
        emptyTitle,
        emptyDescription,
        accent = "violet",
        viewAllAction,
    }) => {
        const accentText =
            accent === "fuchsia"
                ? "text-fuchsia-400/60"
                : "text-violet-400/60";

        return (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p
                            className={`text-[9px] font-bold uppercase tracking-[0.25em] ${accentText}`}
                        >
                            {label}
                        </p>

                        <h2 className="mt-1 text-lg font-bold">
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={viewAllAction}
                        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-violet-300 transition-colors hover:bg-violet-500/[0.08] hover:text-violet-200"
                    >
                        View all
                        <ArrowRight size={13} />
                    </button>
                </div>

                <div className="mt-5">
                    {projectsLoading ? (
                        <div className="grid gap-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-28 animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.02]"
                                />
                            ))}
                        </div>
                    ) : projects.length > 0 ? (
                        <div className="grid gap-3">
                            {projects
                                .slice(0, 3)
                                .map((project) => (
                                    <ProjectCard
                                        key={
                                            project?._id ||
                                            project?.id
                                        }
                                        project={project}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] px-5 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.05]">
                                <FolderKanban
                                    size={20}
                                    className="text-violet-300/50"
                                />
                            </div>

                            <h3 className="mt-3 text-sm font-semibold text-white/60">
                                {emptyTitle}
                            </h3>

                            <p className="mt-1 max-w-sm text-xs leading-5 text-white/25">
                                {emptyDescription}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1600px]">
                {/* Welcome */}
                <section className="animate-fade-up">
                    <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 animate-pulse-glow rounded-full bg-violet-600/10 blur-3xl" />

                        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-3 py-1.5">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-300/70">
                                        Workspace online
                                    </span>
                                </div>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    Welcome back,

                                    <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
                                        {user?.name || "Student"}.
                                    </span>
                                </h1>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                                    Your collaboration workspace is
                                    ready. Discover ideas, build teams
                                    and turn your next project into
                                    something real.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/projects/create"
                                        )
                                    }
                                    className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/30"
                                >
                                    <Plus
                                        size={16}
                                        className="transition-transform duration-300 group-hover:rotate-90"
                                    />

                                    Create Project
                                </button>

                                <button
                                    type="button"
                                    onClick={openDiscover}
                                    className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-5 py-3 text-xs font-bold text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.05] hover:text-violet-300"
                                >
                                    Discover Projects

                                    <ArrowRight
                                        size={15}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-4 py-3 text-xs text-red-300">
                        {error}
                    </div>
                )}

                {/* Stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="animate-fade-up [animation-delay:100ms]">
                        <StatCard
                            label="My Projects"
                            value={
                                loading
                                    ? "—"
                                    : stats.myProjects
                            }
                            description="Projects you own"
                            icon={FolderKanban}
                            accent="violet"
                        />
                    </div>

                    <div className="animate-fade-up [animation-delay:200ms]">
                        <StatCard
                            label="Joined Projects"
                            value={
                                loading
                                    ? "—"
                                    : stats.joinedProjects
                            }
                            description="Teams you're part of"
                            icon={Users}
                            accent="fuchsia"
                        />
                    </div>

                    <div className="animate-fade-up [animation-delay:300ms]">
                        <StatCard
                            label="My Tasks"
                            value={
                                loading
                                    ? "—"
                                    : stats.myTasks
                            }
                            description="Tasks assigned to you"
                            icon={CheckSquare}
                            accent="cyan"
                        />
                    </div>

                    <div className="animate-fade-up [animation-delay:400ms]">
                        <StatCard
                            label="Experience"
                            value={
                                loading
                                    ? "—"
                                    : stats.experiencePoints
                            }
                            description="Experience points"
                            icon={Activity}
                            accent="emerald"
                        />
                    </div>
                </section>

                {/* Projects */}
                <section className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div className="animate-fade-up [animation-delay:150ms]">
                        <ProjectSection
                            title="My Projects"
                            label="Owned projects"
                            projects={myProjects}
                            emptyTitle="No projects yet"
                            emptyDescription="Create your first project and start building your team."
                            accent="violet"
                            viewAllAction={openMyProjects}
                        />
                    </div>

                    <div className="animate-fade-up [animation-delay:250ms]">
                        <ProjectSection
                            title="Joined Projects"
                            label="Team collaboration"
                            projects={joinedProjects}
                            emptyTitle="No joined projects"
                            emptyDescription="Discover projects and join a team that matches your skills."
                            accent="fuchsia"
                            viewAllAction={openDiscover}
                        />
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-6 animate-fade-up [animation-delay:350ms]">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-400/60">
                                Shortcuts
                            </p>

                            <h2 className="mt-1 text-lg font-bold">
                                Quick Actions
                            </h2>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/projects/create"
                                    )
                                }
                                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-violet-500/[0.04]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/[0.06]">
                                    <Plus
                                        size={18}
                                        className="text-violet-300"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-white/70">
                                        Create Project
                                    </p>

                                    <p className="mt-1 text-[10px] text-white/25">
                                        Start a new project
                                    </p>
                                </div>

                                <ArrowRight
                                    size={14}
                                    className="ml-auto text-white/15 transition-transform group-hover:translate-x-1 group-hover:text-violet-300"
                                />
                            </button>

                            <button
                                type="button"
                                onClick={openDiscover}
                                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/[0.04]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-fuchsia-400/10 bg-fuchsia-500/[0.06]">
                                    <Search
                                        size={18}
                                        className="text-fuchsia-300"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-white/70">
                                        Discover Projects
                                    </p>

                                    <p className="mt-1 text-[10px] text-white/25">
                                        Find teams to join
                                    </p>
                                </div>

                                <ArrowRight
                                    size={14}
                                    className="ml-auto text-white/15 transition-transform group-hover:translate-x-1 group-hover:text-fuchsia-300"
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/notifications"
                                    )
                                }
                                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-cyan-500/[0.04]"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-500/[0.06]">
                                    <Bell
                                        size={18}
                                        className="text-cyan-300"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-white/70">
                                        Notifications
                                    </p>

                                    <p className="mt-1 text-[10px] text-white/25">
                                        Check your updates
                                    </p>
                                </div>

                                <ArrowRight
                                    size={14}
                                    className="ml-auto text-white/15 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300"
                                />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;