import { useEffect, useState } from "react";

import {
    Activity,
    ArrowRight,
    CheckSquare,
    FolderKanban,
    Plus,
    Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";

import useAuth from "../hooks/useAuth";

import { getDashboardStats } from "../services/dashboardService";

const Dashboard = () => {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        myProjects: 0,
        joinedProjects: 0,
        myTasks: 0,
        experiencePoints: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboardStats = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboardStats();

                setStats(data.stats);
            } catch (error) {
                console.error(
                    "Failed to load dashboard stats:",
                    error.message
                );

                setError(
                    "Unable to load dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboardStats();
    }, []);

    const openMyProjects = () => {
        navigate("/projects");
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
                                    Your collaboration workspace is ready.
                                    Discover ideas, build teams and turn your
                                    next project into something real.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/projects/create")
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
                                    onClick={() =>
                                        navigate("/projects/discover")
                                    }
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

                {/* Main content */}
                <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    {/* My Projects */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={openMyProjects}
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {
                                event.preventDefault();
                                openMyProjects();
                            }
                        }}
                        className="group animate-fade-up cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-white/[0.035] sm:p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-400/60">
                                    Workspace
                                </p>

                                <h2 className="mt-1 text-lg font-bold">
                                    My Projects
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    openMyProjects();
                                }}
                                className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-violet-300 transition-colors hover:bg-violet-500/[0.08] hover:text-violet-200"
                            >
                                View all
                                <ArrowRight size={13} />
                            </button>
                        </div>

                        <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/[0.05]">
                                <FolderKanban
                                    size={21}
                                    className="text-violet-300/60"
                                />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-white/60">
                                {loading
                                    ? "Loading projects..."
                                    : stats.myProjects > 0
                                    ? `${stats.myProjects} project${
                                          stats.myProjects === 1
                                              ? ""
                                              : "s"
                                      } available`
                                    : "No projects yet"}
                            </h3>

                            <p className="mt-1 max-w-xs text-xs leading-5 text-white/25">
                                {stats.myProjects > 0
                                    ? "Open your projects to manage your teams, tasks and progress."
                                    : "Create your first project or discover an existing idea to start collaborating."}
                            </p>

                            {stats.myProjects > 0 ? (
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        openMyProjects();
                                    }}
                                    className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg border border-violet-400/15 bg-violet-500/[0.06] px-4 py-2 text-xs font-semibold text-violet-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/[0.1]"
                                >
                                    View My Projects
                                    <ArrowRight size={13} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        navigate("/projects/create");
                                    }}
                                    className="mt-5 cursor-pointer rounded-lg border border-violet-400/15 bg-violet-500/[0.06] px-4 py-2 text-xs font-semibold text-violet-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/[0.1]"
                                >
                                    Create your first project
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="animate-fade-up [animation-delay:200ms] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-fuchsia-400/60">
                                Live feed
                            </p>

                            <h2 className="mt-1 text-lg font-bold">
                                Recent Activity
                            </h2>
                        </div>

                        <div className="mt-6 flex min-h-48 flex-col items-center justify-center text-center">
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-fuchsia-400/10 bg-fuchsia-500/[0.05]">
                                <span className="absolute h-2 w-2 animate-pulse rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.8)]" />

                                <Activity
                                    size={21}
                                    className="text-fuchsia-300/50"
                                />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-white/60">
                                Activity feed coming next
                            </h3>

                            <p className="mt-1 max-w-xs text-xs leading-5 text-white/25">
                                Project activity, task updates and
                                collaboration events will appear here.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;