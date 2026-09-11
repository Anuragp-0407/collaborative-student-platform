import {
    Bell,
    CheckSquare,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Plus,
    Search,
    Settings,
    UserRound,
    Zap,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const Sidebar = ({ mobile = false }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navigation = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            label: "Discover Projects",
            icon: Search,
            path: "/projects/discover",
        },
        {
            label: "My Projects",
            icon: FolderKanban,
            path: "/projects",
        },
        {
            label: "My Tasks",
            icon: CheckSquare,
            path: "/tasks",
        },
        {
            label: "Notifications",
            icon: Bell,
            path: "/notifications",
        },
    ];

    const secondaryNavigation = [
        {
            label: "Profile",
            icon: UserRound,
            path: "/profile",
        },
        {
            label: "Settings",
            icon: Settings,
            path: "/settings",
        },
    ];

    return (
        <aside
            className={`group/sidebar fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/[0.06] bg-[#090714]/95 backdrop-blur-2xl ${
                mobile ? "flex" : "hidden lg:flex"
            }`}
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/[0.07] blur-3xl" />

            {/* Logo */}
            <div className="relative flex h-20 items-center border-b border-white/[0.06] px-6">
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex cursor-pointer items-center gap-3"
                >
                    <div className="animate-logo-pulse flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/10">
                        <Zap
                            size={20}
                            className="fill-violet-400 text-violet-400"
                        />
                    </div>

                    <div className="text-left">
                        <h1 className="text-base font-black tracking-wide">
                            Student
                            <span className="text-violet-400">
                                Collaborator
                            </span>
                        </h1>

                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-white/25">
                            Collaboration Network
                        </p>
                    </div>
                </button>
            </div>

            {/* Create Project */}
            <div className="relative px-4 pt-5">
                <button
                    type="button"
                    onClick={() => navigate("/projects/create")}
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600/90 to-fuchsia-600/90 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/40 hover:shadow-xl hover:shadow-violet-900/30"
                >
                    <Plus
                        size={17}
                        className="transition-transform duration-300 group-hover:rotate-90"
                    />

                    Create Project
                </button>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 overflow-y-auto px-4 py-6">
                <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
                    Workspace
                </p>

                <div className="space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all duration-300 ${
                                        isActive
                                            ? "border border-violet-400/15 bg-violet-500/[0.08] text-violet-300 shadow-lg shadow-violet-950/10"
                                            : "text-white/40 hover:-translate-y-0.5 hover:bg-white/[0.035] hover:text-white/80"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            size={18}
                                            className={`transition-transform duration-300 group-hover:scale-110 ${
                                                isActive
                                                    ? "text-violet-400"
                                                    : "text-white/30 group-hover:text-violet-300"
                                            }`}
                                        />

                                        <span>{item.label}</span>

                                        {isActive && (
                                            <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="my-7 h-px bg-white/[0.05]" />

                <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/20">
                    Account
                </p>

                <div className="space-y-1">
                    {secondaryNavigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all duration-300 ${
                                        isActive
                                            ? "border border-violet-400/15 bg-violet-500/[0.08] text-violet-300"
                                            : "text-white/40 hover:-translate-y-0.5 hover:bg-white/[0.035] hover:text-white/80"
                                    }`
                                }
                            >
                                <Icon
                                    size={18}
                                    className="text-white/30 transition-colors duration-300 group-hover:text-violet-300"
                                />

                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* User section */}
            <div className="relative border-t border-white/[0.06] p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-sm font-bold text-violet-300">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white/80">
                            {user?.name || "Student"}
                        </p>

                        <p className="truncate text-[10px] text-white/25">
                            {user?.email || "student@example.com"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={logout}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/35 transition-all duration-300 hover:bg-red-500/[0.06] hover:text-red-300"
                >
                    <LogOut
                        size={18}
                        className="transition-transform duration-300 group-hover:-translate-x-0.5"
                    />

                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;