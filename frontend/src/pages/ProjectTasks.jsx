import { useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CheckSquare,
    Circle,
    Clock3,
    Plus,
    UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getProjectTasks } from "../services/projectService";

const ProjectTasks = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProjectTasks(projectId);

                setTasks(data.tasks || []);
            } catch (error) {
                console.error(
                    "Get project tasks error:",
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load project tasks."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    const filteredTasks = useMemo(() => {
        if (activeFilter === "all") {
            return tasks;
        }

        return tasks.filter(
            (task) => task.status === activeFilter
        );
    }, [tasks, activeFilter]);

    const getStatusStyles = (status) => {
        const styles = {
            todo: {
                badge: "border-white/[0.08] bg-white/[0.04] text-white/45",
                icon: Circle,
            },
            "in-progress": {
                badge: "border-amber-400/15 bg-amber-500/[0.07] text-amber-300",
                icon: Clock3,
            },
            completed: {
                badge: "border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300",
                icon: CheckCircle2,
            },
        };

        return (
            styles[status] || {
                badge: "border-white/[0.08] bg-white/[0.04] text-white/45",
                icon: Circle,
            }
        );
    };

    const getPriorityStyles = (priority) => {
        const styles = {
            low: "border-white/[0.07] bg-white/[0.03] text-white/30",
            medium:
                "border-cyan-400/15 bg-cyan-500/[0.06] text-cyan-300",
            high: "border-red-400/15 bg-red-500/[0.06] text-red-300",
        };

        return (
            styles[priority] ||
            "border-white/[0.07] bg-white/[0.03] text-white/30"
        );
    };

    const formatStatus = (status) => {
        if (status === "in-progress") {
            return "In Progress";
        }

        if (status === "todo") {
            return "Todo";
        }

        return "Completed";
    };

    const formatDate = (date) => {
        if (!date) {
            return "No due date";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const filters = [
        { label: "All", value: "all", count: tasks.length },
        {
            label: "Todo",
            value: "todo",
            count: tasks.filter(
                (task) => task.status === "todo"
            ).length,
        },
        {
            label: "In Progress",
            value: "in-progress",
            count: tasks.filter(
                (task) => task.status === "in-progress"
            ).length,
        },
        {
            label: "Completed",
            value: "completed",
            count: tasks.filter(
                (task) => task.status === "completed"
            ).length,
        },
    ];

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-6xl">
                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        navigate(`/projects/${projectId}`)
                    }
                    className="group mb-5 flex cursor-pointer items-center gap-2 text-xs font-semibold text-white/35 transition-colors duration-300 hover:text-violet-300"
                >
                    <ArrowLeft
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    Back to Project
                </button>

                {/* Header */}
                <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.08] blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <CheckSquare
                                    size={15}
                                    className="text-violet-400"
                                />

                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-300/60">
                                    Project Workspace
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                Tasks
                            </h1>

                            <p className="mt-2 text-sm text-white/35">
                                Track work, assignments and project
                                progress.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                // Task creation will be added next.
                            }}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/30"
                        >
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>
                </section>

                {/* Filters */}
                <section className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                    <div className="flex min-w-max items-center gap-1 p-1.5">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() =>
                                    setActiveFilter(filter.value)
                                }
                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                                    activeFilter === filter.value
                                        ? "bg-violet-500/[0.1] text-violet-300"
                                        : "text-white/35 hover:bg-white/[0.04] hover:text-white/60"
                                }`}
                            >
                                {filter.label}

                                <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-white/30">
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Loading */}
                {loading && (
                    <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                        <div className="flex items-center gap-3 text-sm text-white/40">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
                            Loading tasks...
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-red-400/10 bg-red-500/[0.04] px-6 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/15 bg-red-500/[0.07]">
                            <AlertCircle
                                size={20}
                                className="text-red-300"
                            />
                        </div>

                        <h2 className="mt-4 text-sm font-bold text-white/80">
                            Couldn't load tasks
                        </h2>

                        <p className="mt-1 max-w-md text-xs text-red-300/60">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    filteredTasks.length === 0 && (
                        <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.07]">
                                <CheckSquare
                                    size={24}
                                    className="text-violet-300/70"
                                />
                            </div>

                            <h2 className="mt-5 text-base font-bold text-white/80">
                                {tasks.length === 0
                                    ? "No tasks yet"
                                    : "No tasks in this filter"}
                            </h2>

                            <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                                {tasks.length === 0
                                    ? "Create tasks to break your project into manageable pieces of work."
                                    : "Try selecting another task status."}
                            </p>

                            {tasks.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Task creation will be added next.
                                    }}
                                    className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-5 py-3 text-xs font-bold text-violet-300 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.12]"
                                >
                                    <Plus size={15} />
                                    Create First Task
                                </button>
                            )}
                        </div>
                    )}

                {/* Tasks */}
                {!loading &&
                    !error &&
                    filteredTasks.length > 0 && (
                        <section className="mt-6 space-y-3">
                            {filteredTasks.map((task) => {
                                const status =
                                    getStatusStyles(task.status);

                                const StatusIcon =
                                    status.icon;

                                return (
                                    <article
                                        key={task._id}
                                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-violet-400/15 hover:bg-white/[0.035]"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span
                                                        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-semibold ${status.badge}`}
                                                    >
                                                        <StatusIcon
                                                            size={11}
                                                        />
                                                        {formatStatus(
                                                            task.status
                                                        )}
                                                    </span>

                                                    <span
                                                        className={`rounded-lg border px-2.5 py-1 text-[9px] font-semibold capitalize ${getPriorityStyles(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </div>

                                                <h2 className="mt-3 text-sm font-bold text-white/80">
                                                    {task.title}
                                                </h2>

                                                {task.description && (
                                                    <p className="mt-1 max-w-3xl text-xs leading-5 text-white/30">
                                                        {
                                                            task.description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
                                                <div className="flex items-center gap-2 text-[10px] text-white/30">
                                                    <UserRound
                                                        size={13}
                                                    />

                                                    <span>
                                                        {task.assignedTo
                                                            ?.name ||
                                                            "Unassigned"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-[10px] text-white/30">
                                                    <CalendarDays
                                                        size={13}
                                                    />

                                                    <span>
                                                        {formatDate(
                                                            task.dueDate
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                    )}
            </div>
        </DashboardLayout>
    );
};

export default ProjectTasks;