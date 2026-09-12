import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ExternalLink,
    Layers3,
    Rocket,
    Users,
    Code2,
    AlertCircle,
    MessageCircle,
    CheckSquare,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getProjectById } from "../services/projectService";

const ProjectDetails = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProjectById(projectId);

                setProject(data.project);
            } catch (error) {
                console.error(
                    "Get project details error:",
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load project details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const getStatusStyles = (status) => {
        const styles = {
            planning:
                "border-amber-400/15 bg-amber-500/[0.07] text-amber-300",
            active:
                "border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300",
            completed:
                "border-cyan-400/15 bg-cyan-500/[0.07] text-cyan-300",
            cancelled:
                "border-red-400/15 bg-red-500/[0.07] text-red-300",
        };

        return (
            styles[status] ||
            "border-white/10 bg-white/[0.05] text-white/50"
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex items-center gap-3 text-sm text-white/40">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
                        Loading project...
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !project) {
        return (
            <DashboardLayout>
                <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/15 bg-red-500/[0.07]">
                        <AlertCircle
                            size={24}
                            className="text-red-300"
                        />
                    </div>

                    <h1 className="mt-5 text-lg font-bold text-white/80">
                        Project unavailable
                    </h1>

                    <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                        {error ||
                            "The project could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/projects")}
                        className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-violet-300"
                    >
                        <ArrowLeft size={15} />
                        Back to My Projects
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-6xl">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate("/projects")}
                    className="group mb-5 flex cursor-pointer items-center gap-2 text-xs font-semibold text-white/35 transition-colors duration-300 hover:text-violet-300"
                >
                    <ArrowLeft
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    Back to My Projects
                </button>

                {/* Project Header */}
                <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.08] blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg border border-violet-400/15 bg-violet-500/[0.07] px-2.5 py-1 text-[10px] font-semibold text-violet-300/80">
                                        {project.category}
                                    </span>

                                    <span
                                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold capitalize ${getStatusStyles(
                                            project.status
                                        )}`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                                    {project.title}
                                </h1>

                                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/35">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.07]">
                                <Rocket
                                    size={22}
                                    className="text-violet-300"
                                />
                            </div>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2">
                                <Users
                                    size={14}
                                    className="text-fuchsia-300"
                                />

                                <span className="text-xs text-white/45">
                                    {project.members?.length || 0} /{" "}
                                    {project.maxTeamSize} members
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2">
                                <Layers3
                                    size={14}
                                    className="text-cyan-300"
                                />

                                <span className="text-xs text-white/45">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workspace Navigation */}
                <nav className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                    <div className="flex min-w-max items-center gap-1 p-1.5">
                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-violet-500/[0.1] px-4 py-2.5 text-xs font-semibold text-violet-300"
                        >
                            <Layers3 size={14} />
                            Overview
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/projects/${projectId}/tasks`
                                )
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white/35 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/60"
                        >
                            <CheckSquare size={14} />
                            Tasks
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/projects/${projectId}/team`
                                )
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white/35 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/60"
                        >
                            <Users size={14} />
                            Team
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/projects/${projectId}/chat`
                                )
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white/35 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/60"
                        >
                            <MessageCircle size={14} />
                            Chat
                        </button>
                    </div>
                </nav>

                {/* Overview Content */}
                <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    {/* Technologies + Skills */}
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-400/15 bg-fuchsia-500/[0.07]">
                                    <Code2
                                        size={17}
                                        className="text-fuchsia-300"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-bold">
                                        Technologies
                                    </h2>

                                    <p className="mt-0.5 text-[11px] text-white/25">
                                        Technologies used in this project.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {project.technologies?.length > 0 ? (
                                    project.technologies.map(
                                        (technology) => (
                                            <span
                                                key={technology}
                                                className="rounded-lg border border-violet-400/15 bg-violet-500/[0.07] px-3 py-2 text-xs font-medium text-violet-300"
                                            >
                                                {technology}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-xs text-white/25">
                                        No technologies specified.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-500/[0.07]">
                                    <Users
                                        size={17}
                                        className="text-cyan-300"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-bold">
                                        Required Skills
                                    </h2>

                                    <p className="mt-0.5 text-[11px] text-white/25">
                                        Skills needed for this project.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {project.requiredSkills?.length > 0 ? (
                                    project.requiredSkills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-lg border border-fuchsia-400/15 bg-fuchsia-500/[0.07] px-3 py-2 text-xs font-medium text-fuchsia-300"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )
                                ) : (
                                    <p className="text-xs text-white/25">
                                        No required skills specified.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Team */}
                    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold">
                                    Team
                                </h2>

                                <p className="mt-0.5 text-[11px] text-white/25">
                                    People working on this project.
                                </p>
                            </div>

                            <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/35">
                                {project.members?.length || 0}/
                                {project.maxTeamSize}
                            </span>
                        </div>

                        <div className="mt-5 space-y-3">
                            {project.members?.map((member) => (
                                <div
                                    key={member.user?._id}
                                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/10 p-3"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.07] text-xs font-bold text-violet-300">
                                            {member.user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-xs font-semibold text-white/70">
                                                {member.user?.name ||
                                                    "Unknown user"}
                                            </p>

                                            <p className="truncate text-[10px] text-white/25">
                                                {member.user?.email || ""}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="ml-3 shrink-0 text-[9px] font-semibold text-violet-300/60">
                                        {member.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </section>

                {/* Links */}
                {(project.githubUrl || project.demoUrl) && (
                    <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-500/[0.07]">
                                <ExternalLink
                                    size={17}
                                    className="text-emerald-300"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold">
                                    Project Links
                                </h2>

                                <p className="mt-0.5 text-[11px] text-white/25">
                                    External resources for this project.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white/55 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-violet-300"
                                >
                                    <span className="text-[11px] font-bold">
                                        GH
                                    </span>
                                    GitHub
                                    <ExternalLink size={12} />
                                </a>
                            )}

                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white/55 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-500/[0.06] hover:text-cyan-300"
                                >
                                    <ExternalLink size={15} />
                                    Live Demo
                                </a>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProjectDetails;