import { useEffect, useRef, useState } from "react";

import {
    Bell,
    Menu,
    Search,
    UserRound,
    X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { getProjects } from "../../services/projectService";

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearchResults, setShowSearchResults] =
        useState(false);

    // --------------------------------------------------
    // KEYBOARD SHORTCUT
    // Press "/" to focus the search bar
    // --------------------------------------------------

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                event.key === "/" &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey &&
                !event.shiftKey
            ) {
                const activeElement =
                    document.activeElement;

                const isTyping =
                    activeElement?.tagName === "INPUT" ||
                    activeElement?.tagName === "TEXTAREA" ||
                    activeElement?.isContentEditable;

                if (isTyping) {
                    return;
                }

                event.preventDefault();

                searchInputRef.current?.focus();
            }

            if (
                event.key === "Escape" &&
                document.activeElement ===
                    searchInputRef.current
            ) {
                searchInputRef.current?.blur();
                setShowSearchResults(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    // --------------------------------------------------
    // CLOSE SEARCH RESULTS WHEN CLICKING OUTSIDE
    // --------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(
                    event.target
                )
            ) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // --------------------------------------------------
    // SEARCH PROJECTS
    // --------------------------------------------------

    useEffect(() => {
        const query = searchQuery.trim();

        if (!query) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchLoading(true);
                setShowSearchResults(true);

                const data = await getProjects({
                    search: query,
                });

                setSearchResults(
                    (data.projects || []).slice(0, 5)
                );
            } catch (error) {
                console.error(
                    "Project search error:",
                    error.message
                );

                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // --------------------------------------------------
    // SEARCH RESULT CLICK
    // --------------------------------------------------

    const handleProjectClick = (projectId) => {
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);

        navigate(`/projects/${projectId}`);
    };

    // --------------------------------------------------
    // CLEAR SEARCH
    // --------------------------------------------------

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowSearchResults(false);

        searchInputRef.current?.focus();
    };

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
                <div
                    ref={searchContainerRef}
                    className="relative hidden md:block"
                >
                    <div
                        className={`flex h-10 w-56 items-center gap-2 rounded-xl border bg-white/[0.025] px-4 transition-all duration-300 lg:w-64 ${
                            showSearchResults
                                ? "border-violet-400/25 bg-violet-500/[0.04]"
                                : "border-white/[0.07] hover:border-violet-400/20 hover:bg-violet-500/[0.04]"
                        }`}
                    >
                        <Search
                            size={15}
                            className="shrink-0 text-white/25"
                        />

                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            onFocus={() => {
                                if (searchQuery.trim()) {
                                    setShowSearchResults(true);
                                }
                            }}
                            placeholder="Search projects..."
                            className="min-w-0 flex-1 bg-transparent text-xs text-white/80 outline-none placeholder:text-white/25"
                            aria-label="Search projects"
                        />

                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                                aria-label="Clear search"
                            >
                                <X size={13} />
                            </button>
                        ) : (
                            <kbd className="ml-1 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/20">
                                /
                            </kbd>
                        )}
                    </div>

                    {/* Search Results */}
                    {showSearchResults && (
                        <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111018] shadow-2xl shadow-black/50">
                            {/* Loading */}
                            {searchLoading && (
                                <div className="flex items-center gap-3 px-4 py-4">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

                                    <span className="text-xs text-white/35">
                                        Searching projects...
                                    </span>
                                </div>
                            )}

                            {/* Results */}
                            {!searchLoading &&
                                searchResults.length > 0 && (
                                    <div className="p-2">
                                        <p className="px-3 pb-2 pt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                                            Projects
                                        </p>

                                        {searchResults.map(
                                            (project) => (
                                                <button
                                                    key={
                                                        project._id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleProjectClick(
                                                            project._id
                                                        )
                                                    }
                                                    className="group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-violet-500/[0.07]"
                                                >
                                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/10 bg-violet-500/[0.06]">
                                                        <Search
                                                            size={
                                                                14
                                                            }
                                                            className="text-violet-300/60"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-white/70 transition-colors group-hover:text-violet-300">
                                                            {
                                                                project.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-[10px] text-white/25">
                                                            {project.category ||
                                                                "Project"}
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}

                            {/* No results */}
                            {!searchLoading &&
                                searchQuery.trim() &&
                                searchResults.length ===
                                    0 && (
                                    <div className="px-4 py-6 text-center">
                                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025]">
                                            <Search
                                                size={15}
                                                className="text-white/20"
                                            />
                                        </div>

                                        <p className="mt-3 text-xs font-semibold text-white/45">
                                            No projects found
                                        </p>

                                        <p className="mt-1 text-[10px] text-white/20">
                                            Try a different project
                                            name.
                                        </p>
                                    </div>
                                )}
                        </div>
                    )}
                </div>

                {/* Notification */}
                <button
                    type="button"
                    onClick={() =>
                        navigate("/notifications")
                    }
                    className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/40 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.05] hover:text-violet-300"
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
                    onClick={() => navigate("/profile")}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5 pr-3 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-300">
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
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