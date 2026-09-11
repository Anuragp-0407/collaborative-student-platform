import { useRef, useState } from "react";
import {
    ArrowLeft,
    Check,
    Code2,
    ExternalLink,
    Layers3,
    Plus,
    Rocket,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { createProject } from "../services/projectService";

const CreateProject = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        maxTeamSize: 4,
        githubUrl: "",
        demoUrl: "",
    });

    const [technologies, setTechnologies] = useState([]);
    const [requiredSkills, setRequiredSkills] = useState([]);

    const [technologyInput, setTechnologyInput] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const categoryRef = useRef(null);
    const technologyInputRef = useRef(null);
    const skillInputRef = useRef(null);
    const maxTeamSizeRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            submit: "",
        }));
    };

    const addTechnology = () => {
        const value = technologyInput.trim();

        if (!value) {
            return;
        }

        if (
            technologies.some(
                (technology) =>
                    technology.toLowerCase() === value.toLowerCase()
            )
        ) {
            setTechnologyInput("");
            return;
        }

        setTechnologies((previous) => [...previous, value]);
        setTechnologyInput("");

        setErrors((previous) => ({
            ...previous,
            technologies: "",
            submit: "",
        }));
    };

    const removeTechnology = (technologyToRemove) => {
        setTechnologies((previous) =>
            previous.filter(
                (technology) => technology !== technologyToRemove
            )
        );
    };

    const addSkill = () => {
        const value = skillInput.trim();

        if (!value) {
            return;
        }

        if (
            requiredSkills.some(
                (skill) =>
                    skill.toLowerCase() === value.toLowerCase()
            )
        ) {
            setSkillInput("");
            return;
        }

        setRequiredSkills((previous) => [...previous, value]);
        setSkillInput("");

        setErrors((previous) => ({
            ...previous,
            requiredSkills: "",
            submit: "",
        }));
    };

    const removeSkill = (skillToRemove) => {
        setRequiredSkills((previous) =>
            previous.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleTechnologyKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTechnology();
        }
    };

    const handleSkillKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSkill();
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Project title is required.";
        }

        if (!formData.description.trim()) {
            newErrors.description =
                "Project description is required.";
        }

        if (!formData.category.trim()) {
            newErrors.category =
                "Project category is required.";
        }

        if (technologies.length === 0) {
            newErrors.technologies =
                "Add at least one technology.";
        }

        if (requiredSkills.length === 0) {
            newErrors.requiredSkills =
                "Add at least one required skill.";
        }

        if (
            !formData.maxTeamSize ||
            Number(formData.maxTeamSize) < 1 ||
            Number(formData.maxTeamSize) > 20
        ) {
            newErrors.maxTeamSize =
                "Team size must be between 1 and 20.";
        }

        setErrors(newErrors);

        const errorRefs = {
            title: titleRef,
            description: descriptionRef,
            category: categoryRef,
            technologies: technologyInputRef,
            requiredSkills: skillInputRef,
            maxTeamSize: maxTeamSizeRef,
        };

        const firstError = Object.keys(newErrors)[0];

        if (firstError && errorRefs[firstError]?.current) {
            setTimeout(() => {
                errorRefs[firstError].current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                errorRefs[firstError].current.focus();
            }, 50);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSuccess("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            setLoading(true);

            const projectData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                technologies,
                requiredSkills,
                maxTeamSize: Number(formData.maxTeamSize),
                githubUrl: formData.githubUrl.trim(),
                demoUrl: formData.demoUrl.trim(),
            };

            await createProject(projectData);

            setSuccess("Project created successfully!");

            setTimeout(() => {
                navigate("/dashboard", {
                    replace: true,
                });
            }, 1500);
        } catch (error) {
            console.error(
                "Create project error:",
                error.message
            );

            const message =
                error.response?.data?.message ||
                "Unable to create project. Please try again.";

            setErrors({
                submit: message,
            });

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl">
                {/* Success Toast */}
                {success && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
                      <div className="w-full max-w-md animate-fade-up">
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-[#0d0b18]/95 px-4 py-3 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
                                <Check
                                    size={18}
                                    className="text-emerald-300"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white/85">
                                    Project Created
                                </p>

                                <p className="mt-0.5 text-[11px] text-emerald-300/70">
                                    Your project was created successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                {/* Header */}
                <section className="animate-fade-up">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="group mb-5 flex cursor-pointer items-center gap-2 text-xs font-semibold text-white/35 transition-colors duration-300 hover:text-violet-300"
                    >
                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />

                        Back to Dashboard
                    </button>

                    <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 animate-pulse-glow rounded-full bg-violet-600/10 blur-3xl" />

                        <div className="relative flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                                <Rocket
                                    size={22}
                                    className="text-violet-300"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <Sparkles
                                        size={13}
                                        className="text-fuchsia-400"
                                    />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-300/60">
                                        New Workspace
                                    </span>
                                </div>

                                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                    Create a Project
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                                    Turn your idea into a collaborative
                                    project and find students who can
                                    help you build it.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Submit Error */}
                {errors.submit && (
                    <div className="mt-5 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-4 py-3 text-xs text-red-300">
                        {errors.submit}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-6"
                >
                    {/* Basic Information */}
                    <section className="animate-fade-up rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.07]">
                                <Layers3
                                    size={17}
                                    className="text-violet-300"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold">
                                    Basic Information
                                </h2>

                                <p className="mt-0.5 text-[11px] text-white/25">
                                    Define what your project is about.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5">
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-xs font-semibold text-white/55"
                                >
                                    Project Title
                                </label>

                                <input
                                    ref={titleRef}
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Campus Event Management Platform"
                                    className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 ${
                                        errors.title
                                            ? "border-red-400/40 bg-red-500/[0.03] focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
                                            : "border-white/[0.08] focus:border-violet-400/30 focus:bg-violet-500/[0.03] focus:ring-2 focus:ring-violet-500/10"
                                    }`}
                                />

                                {errors.title && (
                                    <p className="mt-2 text-[11px] text-red-300">
                                        ⚠ {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-xs font-semibold text-white/55"
                                >
                                    Description
                                </label>

                                <textarea
                                    ref={descriptionRef}
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Explain your project idea, what problem it solves and what you want to build..."
                                    className={`w-full resize-none rounded-xl border bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition-all duration-300 placeholder:text-white/20 ${
                                        errors.description
                                            ? "border-red-400/40 bg-red-500/[0.03] focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
                                            : "border-white/[0.08] focus:border-violet-400/30 focus:bg-violet-500/[0.03] focus:ring-2 focus:ring-violet-500/10"
                                    }`}
                                />

                                {errors.description && (
                                    <p className="mt-2 text-[11px] text-red-300">
                                        ⚠ {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-xs font-semibold text-white/55"
                                >
                                    Category
                                </label>

                                <input
                                    ref={categoryRef}
                                    id="category"
                                    name="category"
                                    type="text"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Web Development, AI/ML, Mobile"
                                    className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 ${
                                        errors.category
                                            ? "border-red-400/40 bg-red-500/[0.03] focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
                                            : "border-white/[0.08] focus:border-violet-400/30 focus:bg-violet-500/[0.03] focus:ring-2 focus:ring-violet-500/10"
                                    }`}
                                />

                                {errors.category && (
                                    <p className="mt-2 text-[11px] text-red-300">
                                        ⚠ {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Requirements */}
                    <section className="animate-fade-up rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-400/15 bg-fuchsia-500/[0.07]">
                                <Code2
                                    size={17}
                                    className="text-fuchsia-300"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold">
                                    Project Requirements
                                </h2>

                                <p className="mt-0.5 text-[11px] text-white/25">
                                    Tell collaborators what your
                                    project needs.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {/* Technologies */}
                            <div>
                                <label
                                    htmlFor="technologyInput"
                                    className="mb-2 block text-xs font-semibold text-white/55"
                                >
                                    Technologies
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        ref={technologyInputRef}
                                        id="technologyInput"
                                        type="text"
                                        value={technologyInput}
                                        onChange={(event) =>
                                            setTechnologyInput(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleTechnologyKeyDown
                                        }
                                        placeholder="e.g. React"
                                        className={`min-w-0 flex-1 rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 ${
                                            errors.technologies
                                                ? "border-red-400/40 bg-red-500/[0.03] focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
                                                : "border-white/[0.08] focus:border-violet-400/30 focus:bg-violet-500/[0.03] focus:ring-2 focus:ring-violet-500/10"
                                        }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={addTechnology}
                                        className="flex cursor-pointer items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-4 text-violet-300 transition-all duration-300 hover:border-violet-400/30 hover:bg-violet-500/[0.12]"
                                        aria-label="Add technology"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {technologies.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {technologies.map(
                                            (technology) => (
                                                <span
                                                    key={technology}
                                                    className="group flex items-center gap-2 rounded-lg border border-violet-400/15 bg-violet-500/[0.07] px-3 py-1.5 text-xs font-medium text-violet-300"
                                                >
                                                    {technology}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTechnology(
                                                                technology
                                                            )
                                                        }
                                                        className="cursor-pointer text-violet-300/40 transition-colors hover:text-red-300"
                                                        aria-label={`Remove ${technology}`}
                                                    >
                                                        <X size={13} />
                                                    </button>
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}

                                {errors.technologies && (
                                    <p className="mt-2 text-[11px] text-red-300">
                                        ⚠ {errors.technologies}
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            <div>
                                <label
                                    htmlFor="skillInput"
                                    className="mb-2 block text-xs font-semibold text-white/55"
                                >
                                    Required Skills
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        ref={skillInputRef}
                                        id="skillInput"
                                        type="text"
                                        value={skillInput}
                                        onChange={(event) =>
                                            setSkillInput(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={handleSkillKeyDown}
                                        placeholder="e.g. Frontend Development"
                                        className={`min-w-0 flex-1 rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 ${
                                            errors.requiredSkills
                                                ? "border-red-400/40 bg-red-500/[0.03] focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
                                                : "border-white/[0.08] focus:border-fuchsia-400/30 focus:bg-fuchsia-500/[0.03] focus:ring-2 focus:ring-fuchsia-500/10"
                                        }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="flex cursor-pointer items-center justify-center rounded-xl border border-fuchsia-400/15 bg-fuchsia-500/[0.07] px-4 text-fuchsia-300 transition-all duration-300 hover:border-fuchsia-400/30 hover:bg-fuchsia-500/[0.12]"
                                        aria-label="Add required skill"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {requiredSkills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {requiredSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="flex items-center gap-2 rounded-lg border border-fuchsia-400/15 bg-fuchsia-500/[0.07] px-3 py-1.5 text-xs font-medium text-fuchsia-300"
                                            >
                                                {skill}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(
                                                            skill
                                                        )
                                                    }
                                                    className="cursor-pointer text-fuchsia-300/40 transition-colors hover:text-red-300"
                                                    aria-label={`Remove ${skill}`}
                                                >
                                                    <X size={13} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {errors.requiredSkills && (
                                    <p className="mt-2 text-[11px] text-red-300">
                                        ⚠ {errors.requiredSkills}
                                    </p>
                                )}
                            </div>

                            {/* Team Size */}
                            <div className="max-w-sm">
                                <label
                                    htmlFor="maxTeamSize"
                                    className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/55"
                                >
                                    <Users size={14} />
                                    Maximum Team Size
                                </label>

                                <input
                                    ref={maxTeamSizeRef}
                                    id="maxTeamSize"
                                    name="maxTeamSize"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.maxTeamSize}
                                    onChange={handleChange}
                                    className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 ${
                                        errors.maxTeamSize
                                            ? "border-red-400/40 bg-red-500/[0.03] focus:border-red-400/60 focus:ring-2 focus:ring-red-500/10"
                                            : "border-white/[0.08] focus:border-violet-400/30 focus:bg-violet-500/[0.03] focus:ring-2 focus:ring-violet-500/10"
                                    }`}
                                />

                                {errors.maxTeamSize ? (
                                    <p className="mt-2 text-[11px] text-red-300">
                                        ⚠ {errors.maxTeamSize}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-[10px] text-white/20">
                                        Include yourself when deciding
                                        the maximum team size. Maximum
                                        allowed is 20.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Links */}
                    <section className="animate-fade-up rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-500/[0.07]">
                                <ExternalLink
                                    size={17}
                                    className="text-cyan-300"
                                />
                            </div>

                            <div>
                                <h2 className="text-base font-bold">
                                    Project Links
                                </h2>

                                <p className="mt-0.5 text-[11px] text-white/25">
                                    Optional links to help collaborators
                                    explore your work.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {/* GitHub */}
                            <div>
                                <label
                                    htmlFor="githubUrl"
                                    className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/55"
                                >
                                    <span className="text-[11px] font-bold">
                                        GH
                                    </span>
                                    GitHub URL
                                </label>

                                <input
                                    id="githubUrl"
                                    name="githubUrl"
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-violet-400/30 focus:bg-violet-500/[0.03] focus:ring-2 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Demo */}
                            <div>
                                <label
                                    htmlFor="demoUrl"
                                    className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/55"
                                >
                                    <ExternalLink size={14} />
                                    Demo URL
                                </label>

                                <input
                                    id="demoUrl"
                                    name="demoUrl"
                                    type="url"
                                    value={formData.demoUrl}
                                    onChange={handleChange}
                                    placeholder="https://your-project.com"
                                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-cyan-400/30 focus:bg-cyan-500/[0.03] focus:ring-2 focus:ring-cyan-500/10"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <section className="animate-fade-up flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            disabled={loading}
                            className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.025] px-6 py-3 text-xs font-bold text-white/45 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Rocket
                                size={16}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                            />

                            {loading
                                ? "Creating Project..."
                                : "Create Project"}
                        </button>
                    </section>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateProject;