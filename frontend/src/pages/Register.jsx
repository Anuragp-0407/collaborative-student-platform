import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    User,
    Users,
    Zap,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
        setLoading(true);
        setError("");

        await register({
            name: name.trim(),
            email: email.trim(),
            password,
        });

        navigate("/dashboard", {
            replace: true,
        });
    } catch (err) {
        setError(
            err.response?.data?.message ||
                "Registration failed. Please try again."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080611] text-white">
            {/* Background grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(168,85,247,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.35) 1px, transparent 1px)",
                    backgroundSize: "55px 55px",
                }}
            />

            {/* Background glow */}
            <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 animate-pulse-glow rounded-full bg-violet-700/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 right-0 h-[32rem] w-[32rem] animate-pulse-glow rounded-full bg-fuchsia-700/10 blur-3xl" />

            <div className="relative z-10 flex min-h-screen">
                {/* LEFT — Register form */}
                <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[52%] lg:px-16">
                    <div className="w-full max-w-xl animate-fade-up">
                        {/* Brand */}
                        <div className="mb-10 flex items-center gap-3">
                            <div className="animate-logo-pulse flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10">
                                <Zap
                                    size={22}
                                    className="fill-violet-400 text-violet-400"
                                />
                            </div>

                            <div>
                                <p className="text-lg font-bold tracking-wide">
                                    Student
                                    <span className="text-violet-400">
                                        Collaborator
                                    </span>
                                </p>

                                <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                                    Build together
                                </p>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="mb-8">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/5 px-3 py-1.5 text-xs text-violet-300">
                                <Users size={13} />
                                Join the collaboration network
                            </div>

                            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                                Create your
                                <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
                                    account.
                                </span>
                            </h1>

                            <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                                Create your profile, showcase your skills and
                                start building projects with other students.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
                                >
                                    Full name
                                </label>

                                <div className="group relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-violet-400"
                                    />

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/20 focus:border-violet-500/60 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
                                >
                                    Email address
                                </label>

                                <div className="group relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-violet-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/20 focus:border-violet-500/60 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
                                >
                                    Password
                                </label>

                                <div className="group relative">
                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-violet-400"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                        autoComplete="new-password"
                                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/20 focus:border-violet-500/60 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-violet-300"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/45"
                                >
                                    Confirm password
                                </label>

                                <div className="group relative">
                                    <CheckCircle2
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 transition-colors group-focus-within:text-violet-400"
                                    />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-12 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:border-white/20 focus:border-violet-500/60 focus:bg-violet-500/[0.04] focus:ring-4 focus:ring-violet-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-violet-300"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="animate-fade-up rounded-xl border border-red-400/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-bold shadow-lg shadow-violet-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/40 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />

                                {loading ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight
                                            size={18}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login link */}
                        <p className="mt-8 text-center text-sm text-white/40">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </section>

                {/* RIGHT — Visual panel */}
                <section className="relative hidden overflow-hidden border-l border-white/5 bg-[#0b0818] lg:flex lg:w-[48%]">
                    {/* Grid */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)",
                            backgroundSize: "42px 42px",
                        }}
                    />

                    {/* Main glow */}
                    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-violet-600/10 blur-3xl" />

                    <div className="relative z-10 flex w-full flex-col justify-center px-10 xl:px-20">
                        {/* Top status */}
                        <div className="mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-violet-300/60">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                                Network online
                            </div>

                            <span className="font-mono text-[10px] text-white/20">
                                SYS_01
                            </span>
                        </div>

                        {/* Collaboration visual */}
                        <div className="relative mx-auto flex h-[330px] w-full max-w-lg items-center justify-center">
                            {/* Orbital rings */}
                            <div className="absolute h-64 w-64 animate-[spin_18s_linear_infinite] rounded-full border border-violet-400/10" />
                            <div className="absolute h-48 w-48 animate-[spin_12s_linear_infinite_reverse] rounded-full border border-fuchsia-400/10" />

                            {/* Center */}
                            <div className="relative z-20 flex h-28 w-28 animate-logo-pulse items-center justify-center rounded-3xl border border-violet-400/30 bg-violet-500/10 backdrop-blur-xl">
                                <Users
                                    size={48}
                                    className="text-violet-300"
                                />
                            </div>

                            {/* Nodes */}
                            <div className="absolute left-[12%] top-[22%] flex h-14 w-14 animate-float items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                                <User size={22} className="text-fuchsia-300" />
                            </div>

                            <div className="absolute right-[12%] top-[22%] flex h-14 w-14 animate-float items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl [animation-delay:1s]">
                                <Zap size={22} className="text-violet-300" />
                            </div>

                            <div className="absolute bottom-[12%] left-1/2 flex h-14 w-14 -translate-x-1/2 animate-float items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl [animation-delay:2s]">
                                <Users size={22} className="text-fuchsia-300" />
                            </div>

                            {/* Connecting lines */}
                            <div className="absolute left-[24%] top-[38%] h-px w-[25%] rotate-[22deg] bg-gradient-to-r from-transparent via-violet-400/40 to-violet-400/10" />

                            <div className="absolute right-[24%] top-[38%] h-px w-[25%] -rotate-[22deg] bg-gradient-to-r from-violet-400/10 via-violet-400/40 to-transparent" />

                            <div className="absolute bottom-[27%] left-1/2 h-[25%] w-px -translate-x-1/2 bg-gradient-to-b from-violet-400/30 to-transparent" />
                        </div>

                        {/* Text */}
                        <div className="mx-auto mt-6 max-w-lg text-center">
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-violet-400/60">
                                CONNECT • BUILD • CREATE
                            </p>

                            <h2 className="text-3xl font-black tracking-tight xl:text-4xl">
                                Your next project
                                <span className="block text-violet-400">
                                    starts here.
                                </span>
                            </h2>

                            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/35">
                                Find students with complementary skills,
                                create teams and turn ideas into real projects.
                            </p>
                        </div>

                        {/* Bottom cards */}
                        <div className="mt-10 grid grid-cols-3 gap-3">
                            {[
                                ["01", "Discover", "Ideas"],
                                ["02", "Connect", "People"],
                                ["03", "Build", "Projects"],
                            ].map(([number, title, subtitle]) => (
                                <div
                                    key={number}
                                    className="group rounded-xl border border-white/5 bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.04]"
                                >
                                    <p className="font-mono text-[9px] text-violet-400/50">
                                        {number}
                                    </p>

                                    <p className="mt-2 text-xs font-bold text-white/75">
                                        {title}
                                    </p>

                                    <p className="mt-1 text-[10px] text-white/25">
                                        {subtitle}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Register;