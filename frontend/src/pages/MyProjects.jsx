import { useEffect, useState } from "react";
import {
    FolderKanban,
    Plus,
    Rocket,
    Users,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getMyProjects } from "../services/projectService";

const MyProjects = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyProjects();

                setProjects(data.projects || []);
            } catch (error) {
                console.error(
                    "Get my projects error:",
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load your projects."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

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

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <section className="animate-fade-up">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <FolderKanban
                                    size={15}
                                    className="text-violet-400"
                                />

                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-300/60">
                                    Workspace
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                My Projects
                            </h1>

                            <p className="mt-2 text-sm text-white/35">
                                Manage the projects you've created and
                                build them with your team.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/projects/create")
                            }
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/30"
                        >
                            <Plus size={16} />
                            Create Project
                        </button>
                    </div>
                </section>

                {/* Loading */}
                {loading && (
                    <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                        <div className="flex items-center gap-3 text-sm text-white/40">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
                            Loading your projects...
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-red-400/10 bg-red-500/[0.04] px-6 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/15 bg-red-500/[0.07]">
                            <AlertCircle
                                size={20}
                                className="text-red-300"
                            />
                        </div>

                        <h2 className="mt-4 text-sm font-bold text-white/80">
                            Couldn't load projects
                        </h2>

                        <p className="mt-1 max-w-md text-xs text-red-300/60">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && projects.length === 0 && (
                    <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] px-6 text-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-violet-500/10 blur-xl" />

                            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.07]">
                                <Rocket
                                    size={24}
                                    className="text-violet-300"
                                />
                            </div>
                        </div>

                        <h2 className="mt-5 text-base font-bold text-white/80">
                            No projects yet
                        </h2>

                        <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                            You haven't created any projects yet.
                            Turn your idea into a collaborative project
                            and start building with other students.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/projects/create")
                            }
                            className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-5 py-3 text-xs font-bold text-violet-300 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.12]"
                        >
                            <Plus size={15} />
                            Create Your First Project
                        </button>
                    </div>
                )}

                {/* Project Grid */}
                {!loading && !error && projects.length > 0 && (
                    <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project, index) => (
                            <article
                                key={project._id}
                                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.035]"
                                style={{
                                    animationDelay: `${index * 80}ms`,
                                }}
                            >
                                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-600/[0.06] blur-3xl transition-all duration-500 group-hover:bg-violet-600/[0.1]" />

                                <div className="relative">
                                    {/* Category + Status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="rounded-lg border border-violet-400/10 bg-violet-500/[0.06] px-2.5 py-1 text-[10px] font-semibold text-violet-300/70">
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

                                    {/* Title */}
                                    <h2 className="mt-5 line-clamp-2 text-base font-bold leading-6 text-white/90">
                                        {project.title}
                                    </h2>

                                    {/* Description */}
                                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/30">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    {project.technologies?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {project.technologies
                                                .slice(0, 4)
                                                .map((technology) => (
                                                    <span
                                                        key={technology}
                                                        className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[9px] text-white/35"
                                                    >
                                                        {technology}
                                                    </span>
                                                ))}

                                            {project.technologies.length >
                                                4 && (
                                                <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[9px] text-white/25">
                                                    +
                                                    {project.technologies
                                                        .length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                                        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                                            <Users size={13} />
                                            {project.members?.length || 0} /{" "}
                                            {project.maxTeamSize}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/projects/${project._id}`
                                                )
                                            }
                                            className="flex cursor-pointer items-center gap-1.5 text-[10px] font-bold text-violet-300/70 transition-colors duration-300 hover:text-violet-300"
                                        >
                                            Open Project
                                            <ArrowRight
                                                size={13}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyProjects;