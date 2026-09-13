import { useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    FolderKanban,
    Search,
    SlidersHorizontal,
    Users,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getProjects } from "../services/projectService";

const ProjectDiscovery = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [technology, setTechnology] = useState("");
    const [skill, setSkill] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProjects = async (filters = {}) => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (filters.search?.trim()) {
                params.search = filters.search.trim();
            }

            if (filters.category) {
                params.category = filters.category;
            }

            if (filters.technology?.trim()) {
                params.technology = filters.technology.trim();
            }

            if (filters.skill?.trim()) {
                params.skill = filters.skill.trim();
            }

            const data = await getProjects(params);

            setProjects(data.projects || []);
        } catch (error) {
            console.error(
                "Get discover projects error:",
                error.message
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const applyFilters = () => {
        fetchProjects({
            search,
            category,
            technology,
            skill,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setTechnology("");
        setSkill("");

        fetchProjects();
    };

    const hasFilters =
        search.trim() ||
        category ||
        technology.trim() ||
        skill.trim();

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.08] blur-3xl" />

                    <div className="relative">
                        <div className="mb-2 flex items-center gap-2">
                            <FolderKanban
                                size={15}
                                className="text-violet-400"
                            />

                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-300/60">
                                Project Discovery
                            </span>
                        </div>

                        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                            Discover Projects
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                            Find interesting projects, explore
                            collaboration opportunities and connect
                            with students who share your interests.
                        </p>
                    </div>
                </section>

                {/* Search + Filters */}
                <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
                        {/* Search */}
                        <div className="relative xl:col-span-2">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        applyFilters();
                                    }
                                }}
                                placeholder="Search projects, technologies, skills..."
                                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-violet-400/25 focus:bg-white/[0.035]"
                            />
                        </div>

                        {/* Category */}
                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                            className="cursor-pointer rounded-xl border border-white/[0.07] bg-[#17151f] px-4 py-3 text-xs font-semibold text-white/50 outline-none transition-all duration-300 focus:border-violet-400/25"
                        >
                            <option value="">
                                All Categories
                            </option>

                            <option value="Web Development">
                                Web Development
                            </option>

                            <option value="Mobile Development">
                                Mobile Development
                            </option>

                            <option value="AI / ML">
                                AI / ML
                            </option>

                            <option value="Data Science">
                                Data Science
                            </option>

                            <option value="Cyber Security">
                                Cyber Security
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>

                        {/* Technology */}
                        <input
                            type="text"
                            value={technology}
                            onChange={(event) =>
                                setTechnology(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    applyFilters();
                                }
                            }}
                            placeholder="Technology"
                            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-violet-400/25"
                        />

                        {/* Skill */}
                        <input
                            type="text"
                            value={skill}
                            onChange={(event) =>
                                setSkill(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    applyFilters();
                                }
                            }}
                            placeholder="Required skill"
                            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-violet-400/25"
                        />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-950/20"
                        >
                            <SlidersHorizontal size={14} />
                            Apply Filters
                        </button>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold text-white/30 transition-colors hover:text-violet-300"
                            >
                                <X size={12} />
                                Clear filters
                            </button>
                        )}
                    </div>
                </section>

                {/* Loading */}
                {loading && (
                    <div className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                        <div className="flex items-center gap-3 text-sm text-white/40">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />

                            Loading projects...
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
                            Couldn't load projects
                        </h2>

                        <p className="mt-1 max-w-md text-xs text-red-300/60">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    projects.length === 0 && (
                        <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.07]">
                                <FolderKanban
                                    size={24}
                                    className="text-violet-300/70"
                                />
                            </div>

                            <h2 className="mt-5 text-base font-bold text-white/80">
                                No projects found
                            </h2>

                            <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                                Try changing your search or
                                filters to find more projects.
                            </p>
                        </div>
                    )}

                {/* Projects */}
                {!loading &&
                    !error &&
                    projects.length > 0 && (
                        <>
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-xs text-white/30">
                                    {projects.length}{" "}
                                    {projects.length === 1
                                        ? "project"
                                        : "projects"}{" "}
                                    found
                                </p>
                            </div>

                            <section className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {projects.map((project) => (
                                    <article
                                        key={project._id}
                                        className="group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/15 hover:bg-white/[0.035]"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="rounded-lg border border-violet-400/15 bg-violet-500/[0.07] px-2.5 py-1 text-[9px] font-semibold text-violet-300">
                                                {project.category}
                                            </span>

                                            <span className="text-[9px] font-medium uppercase tracking-wider text-emerald-300/60">
                                                {project.status}
                                            </span>
                                        </div>

                                        <h2 className="mt-4 line-clamp-2 text-base font-bold text-white/85">
                                            {project.title}
                                        </h2>

                                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/30">
                                            {project.description}
                                        </p>

                                        {project.technologies?.length >
                                            0 && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {project.technologies
                                                    .slice(0, 4)
                                                    .map(
                                                        (
                                                            technology
                                                        ) => (
                                                            <span
                                                                key={
                                                                    technology
                                                                }
                                                                className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[9px] text-white/35"
                                                            >
                                                                {
                                                                    technology
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                            </div>
                                        )}

                                        {project.requiredSkills
                                            ?.length > 0 && (
                                            <div className="mt-3">
                                                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-white/20">
                                                    Looking for
                                                </p>

                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.requiredSkills
                                                        .slice(
                                                            0,
                                                            3
                                                        )
                                                        .map(
                                                            (
                                                                skill
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        skill
                                                                    }
                                                                    className="rounded-md border border-cyan-400/10 bg-cyan-500/[0.04] px-2 py-1 text-[9px] text-cyan-300/60"
                                                                >
                                                                    {
                                                                        skill
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-5">
                                            <div className="mb-4 flex items-center gap-2 text-[10px] text-white/30">
                                                <Users size={13} />

                                                <span>
                                                    {
                                                        project
                                                            .members
                                                            ?.length
                                                    }{" "}
                                                    /{" "}
                                                    {
                                                        project.maxTeamSize
                                                    }{" "}
                                                    members
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/projects/${project._id}`
                                                    )
                                                }
                                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-4 py-3 text-xs font-bold text-violet-300 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.12]"
                                            >
                                                View Project

                                                <ArrowRight
                                                    size={14}
                                                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                                                />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        </>
                    )}
            </div>
        </DashboardLayout>
    );
};

export default ProjectDiscovery;