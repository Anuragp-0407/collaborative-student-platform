import {
    Bell,
    Menu,
    Search,
    UserRound,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#080611]/80 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
            {/* Left */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/50 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-violet-300 lg:hidden"
                    aria-label="Open navigation"
                >
                    <Menu size={19} />
                </button>

                <div>
                    <p className="hidden text-[9px] uppercase tracking-[0.3em] text-violet-400/50 sm:block">
                        Student Collaborator
                    </p>

                    <h2 className="text-sm font-bold text-white/80 sm:text-base">
                        Workspace
                    </h2>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search */}
                <button
                    type="button"
                    className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white/25 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.04] hover:text-white/50 md:flex"
                >
                    <Search size={15} />
                    <span>Search projects...</span>
                    <kbd className="ml-3 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/20">
                        /
                    </kbd>
                </button>

                {/* Notification */}
                <button
                    type="button"
                    className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/40 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.05] hover:text-violet-300"
                    aria-label="Notifications"
                >
                    <Bell
                        size={18}
                        className="transition-transform duration-300 group-hover:-rotate-6"
                    />

                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
                </button>

                {/* Profile */}
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5 pr-3 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <span className="hidden max-w-24 truncate text-xs font-semibold text-white/60 sm:block">
                        {user?.name || "Student"}
                    </span>

                    <UserRound
                        size={14}
                        className="hidden text-white/20 sm:block"
                    />
                </button>
            </div>
        </header>
    );
};

export default Topbar;