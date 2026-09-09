import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Activity,
    ArrowRight,
    Box,
    Cloud,
    Eye,
    EyeOff,
    Layers,
    LockKeyhole,
    Mail,
    Terminal,
    Users,
    Zap,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

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

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await login(formData);

            navigate("/dashboard", { replace: true });
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to sign in. Please check your credentials.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#090711] text-white">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 bottom-[-180px] h-[500px] w-[500px] rounded-full bg-violet-800/10 blur-[120px]" />

                <div className="absolute right-[15%] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-700/10 blur-[130px]" />

                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(139,92,246,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.35) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />

                <div className="absolute right-[-10%] top-[35%] h-[250px] w-[80%] rotate-[-22deg] opacity-30 blur-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/20 to-cyan-400/10" />
                    <div className="absolute top-10 h-[2px] w-full bg-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                    <div className="absolute top-24 h-[3px] w-full bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
                    <div className="absolute top-40 h-[2px] w-full bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.7)]" />
                    <div className="absolute top-56 h-[3px] w-full bg-violet-400/20 shadow-[0_0_20px_rgba(167,139,250,0.7)]" />
                </div>
            </div>

            <section className="relative z-10 grid min-h-screen lg:grid-cols-[46%_54%]">

                {/* LEFT — LOGIN */}
                <div className="flex min-h-screen flex-col justify-between border-r border-violet-500/[0.06] bg-[#171022]/95 px-7 py-8 sm:px-12 lg:px-[7vw]">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative grid h-9 w-9 place-items-center">
                            <div className="absolute h-3 w-3 rounded-full bg-violet-500 shadow-[0_0_18px_rgba(139,92,246,0.9)] animate-logo-pulse" />

                            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-500" />
                            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-500" />
                            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-500" />
                            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-500" />
                        </div>

                        <span className="text-xl font-black tracking-tight">
                            CollabHub
                        </span>
                    </div>

                    {/* Form */}
                    <div className="mx-auto w-full max-w-[470px] py-12 lg:mx-0 lg:py-0">

                        <div className="animate-fade-up">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[3px] text-violet-400/70">
                                Student collaboration platform
                            </p>

                            <h1 className="text-4xl font-black tracking-[-2px] sm:text-5xl">
                                SIGN IN
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Access your collaborative workspace
                                environment.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-10 space-y-6 animate-fade-up [animation-delay:120ms]"
                        >
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-[10px] font-bold uppercase tracking-[2px] text-slate-400"
                                >
                                    Work Email
                                </label>

                                <div className="group relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500 transition-colors duration-300 group-focus-within:text-violet-300"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@company.com"
                                        autoComplete="email"
                                        className="h-14 w-full rounded-xl border border-violet-500/15 bg-[#08060f]/80 pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 hover:border-violet-500/30 focus:border-violet-500 focus:bg-[#0c0817] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_0_30px_rgba(139,92,246,0.12)]"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400"
                                    >
                                        Security Cipher
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setError(
                                                "Password recovery will be added soon."
                                            )
                                        }
                                        className="text-[10px] font-bold tracking-[1px] text-violet-500 transition hover:text-violet-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                                    >
                                        FORGOT PASSWORD?
                                    </button>
                                </div>

                                <div className="group relative">
                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500 transition-colors duration-300 group-focus-within:text-violet-300"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="h-14 w-full rounded-xl border border-violet-500/15 bg-[#08060f]/80 pl-12 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 hover:border-violet-500/30 focus:border-violet-500 focus:bg-[#0c0817] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_0_30px_rgba(139,92,246,0.12)]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-violet-300"
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

                            {/* Error */}
                            {error && (
                                <div className="animate-fade-up rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">
                                    {error}
                                </div>
                            )}

                            {/* Login */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-black tracking-wide shadow-[0_12px_35px_rgba(124,58,237,0.25)] transition-all duration-300 hover:-translate-y-1 hover:brightness-110 hover:shadow-[0_18px_45px_rgba(124,58,237,0.4)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                                <span className="relative">
                                    {loading
                                        ? "AUTHENTICATING..."
                                        : "ENTER WORKSPACE"}
                                </span>

                                {!loading && (
                                    <ArrowRight
                                        size={20}
                                        className="relative transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                )}
                            </button>
                        </form>

                        {/* Social */}
                        <div className="mt-8 animate-fade-up [animation-delay:240ms]">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px flex-1 bg-violet-500/10" />

                                <span className="text-[9px] font-bold tracking-[3px] text-slate-600">
                                    OR JOIN WITH
                                </span>

                                <span className="h-px flex-1 bg-violet-500/10" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            "Google authentication will be added later."
                                        )
                                    }
                                    className="group flex h-12 items-center justify-center rounded-xl border border-violet-500/10 bg-white/[0.01] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/[0.05] hover:text-white"
                                >
                                    <span className="text-lg font-black text-white transition-transform group-hover:scale-110">
                                        G
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            "GitHub authentication will be added later."
                                        )
                                    }
                                    className="group flex h-12 items-center justify-center rounded-xl border border-violet-500/10 bg-white/[0.01] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/[0.05] hover:text-white"
                                >
                                    <span className="text-lg font-black text-white transition-transform group-hover:scale-110">
                                        GH
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setError(
                                            "Additional authentication providers will be added later."
                                        )
                                    }
                                    className="group flex h-12 items-center justify-center rounded-xl border border-violet-500/10 bg-white/[0.01] text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/[0.05] hover:text-white"
                                >
                                    <Box
                                        size={19}
                                        className="transition-transform group-hover:rotate-12"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Register */}
                        <p className="mt-7 text-center text-[10px] tracking-wide text-slate-600">
                            DON'T HAVE AN ACCOUNT?

                            <Link
                                to="/register"
                                className="ml-1 font-black text-violet-500 transition hover:text-violet-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                            >
                                REGISTER NOW
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="hidden text-[9px] font-bold uppercase tracking-[2px] text-slate-700 lg:block">
                        <p className="mb-3">
                            © 2026 COLLABHUB. BUILT FOR STUDENT
                            COLLABORATION.
                        </p>

                        <div className="flex gap-3">
                            <span>IDEAS</span>
                            <span className="text-violet-700">•</span>
                            <span>PEOPLE</span>
                            <span className="text-violet-700">•</span>
                            <span>PROJECTS</span>
                            <span className="text-violet-700">•</span>
                            <span>GROWTH</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT — FUTURISTIC VISUAL */}
                <div className="relative hidden min-h-screen overflow-hidden bg-[#080c1a] lg:block">

                    <div className="absolute left-[20%] top-[20%] h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[120px]" />

                    <div className="absolute right-[-10%] top-[35%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

                    {/* Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.12]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
                            backgroundSize: "70px 70px",
                        }}
                    />

                    {/* Realtime card */}
                    <div className="absolute right-[7%] top-[8%] w-[205px] animate-float rounded-2xl border border-violet-500/15 bg-[#21183a]/70 p-5 shadow-2xl backdrop-blur-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <Activity
                                size={20}
                                className="text-violet-500"
                            />

                            <span className="text-[9px] font-bold tracking-wide text-slate-400">
                                REALTIME
                            </span>
                        </div>

                        <div className="mb-3 h-1 overflow-hidden rounded-full bg-violet-500/10">
                            <div className="h-full w-[70%] animate-pulse rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
                        </div>

                        <p className="text-[10px] font-bold tracking-[1px] text-white">
                            NODE LATENCY: 12MS
                        </p>
                    </div>

                    {/* Vector card */}
                    <div className="absolute right-[7%] top-[23%] w-[205px] animate-float rounded-2xl border border-violet-500/15 bg-[#21183a]/70 p-5 shadow-2xl backdrop-blur-xl [animation-delay:1s]">
                        <div className="mb-4 flex h-9 items-end gap-1">
                            {[18, 29, 23, 34].map((height, index) => (
                                <span
                                    key={index}
                                    className="w-1 rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(52,211,153,0.7)] animate-bar-wave"
                                    style={{
                                        height: `${height}px`,
                                        animationDelay: `${index * 120}ms`,
                                    }}
                                />
                            ))}
                        </div>

                        <p className="text-[10px] font-bold tracking-[1px] text-white">
                            ACTIVE VECTORS: 1,402
                        </p>
                    </div>

                    {/* Energy lines */}
                    <div className="absolute right-[-12%] top-[37%] h-[320px] w-[90%] rotate-[-27deg] opacity-50">
                        <div className="absolute top-5 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[1px]" />
                        <div className="absolute top-16 h-[4px] w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent blur-[2px]" />
                        <div className="absolute top-32 h-[3px] w-full bg-gradient-to-r from-transparent via-pink-400/25 to-transparent blur-[2px]" />
                        <div className="absolute top-48 h-[5px] w-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent blur-[3px]" />
                        <div className="absolute top-64 h-[2px] w-full bg-gradient-to-r from-transparent via-violet-400/30 to-transparent blur-[1px]" />
                    </div>

                    {/* Hero */}
                    <div className="absolute bottom-[9%] left-[9%] max-w-[620px] animate-fade-up">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5 text-[9px] font-bold tracking-[1.5px] text-emerald-400">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                            SYSTEM STATUS: OPTIMAL
                        </div>

                        <h2 className="text-5xl font-black leading-[0.98] tracking-[-3px] xl:text-6xl">
                            THE NEXT GENERATION
                            <span className="block">
                                OF TECHNICAL
                            </span>
                            <span className="block">
                                COLLABORATION.
                            </span>
                        </h2>

                        <p className="mt-7 max-w-[570px] text-base leading-7 text-violet-200/70">
                            Step into a high-octane environment where
                            every line of code fuels the machine of
                            progress.
                        </p>
                    </div>

                    {/* Decorative icons */}
                    <div className="absolute bottom-[7%] right-[12%] flex gap-5 text-violet-500/30">
                        <Terminal className="animate-pulse" size={18} />
                        <Cloud className="animate-pulse [animation-delay:300ms]" size={18} />
                        <Layers className="animate-pulse [animation-delay:600ms]" size={18} />
                    </div>

                    <div className="absolute left-[12%] top-[45%] text-violet-500/20">
                        <Users size={24} className="animate-pulse" />
                    </div>

                    <div className="absolute left-[30%] top-[25%] text-violet-400/20">
                        <Zap size={20} className="animate-pulse" />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;