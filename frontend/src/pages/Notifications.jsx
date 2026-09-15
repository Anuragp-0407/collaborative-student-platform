import { useEffect, useState } from "react";

import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    FolderKanban,
    UserPlus,
    UserX,
    XCircle,
    ClipboardCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../services/notificationService";

const Notifications = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [filter, setFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyNotifications({
                    limit: 50,
                });

                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            } catch (error) {
                console.error(
                    "Failed to load notifications:",
                    error.message
                );

                setError(
                    "Unable to load your notifications."
                );
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case "join_request":
                return {
                    icon: UserPlus,
                    className:
                        "border-violet-400/10 bg-violet-500/[0.07] text-violet-300",
                };

            case "join_request_accepted":
                return {
                    icon: Check,
                    className:
                        "border-emerald-400/10 bg-emerald-500/[0.07] text-emerald-300",
                };

            case "join_request_rejected":
                return {
                    icon: XCircle,
                    className:
                        "border-red-400/10 bg-red-500/[0.07] text-red-300",
                };

            case "member_removed":
                return {
                    icon: UserX,
                    className:
                        "border-orange-400/10 bg-orange-500/[0.07] text-orange-300",
                };

            case "task_assigned":
                return {
                    icon: ClipboardCheck,
                    className:
                        "border-cyan-400/10 bg-cyan-500/[0.07] text-cyan-300",
                };

            default:
                return {
                    icon: Bell,
                    className:
                        "border-violet-400/10 bg-violet-500/[0.07] text-violet-300",
                };
        }
    };

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        const notificationDate = new Date(date);
        const now = new Date();

        const difference =
            now.getTime() - notificationDate.getTime();

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        if (hours < 24) {
            return `${hours}h ago`;
        }

        if (days < 7) {
            return `${days}d ago`;
        }

        return notificationDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            setActionLoading(true);

            await markNotificationAsRead(notificationId);

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification._id === notificationId
                        ? {
                              ...notification,
                              read: true,
                          }
                        : notification
                )
            );

            setUnreadCount((currentCount) =>
                Math.max(currentCount - 1, 0)
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error.message
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) {
            return;
        }

        try {
            setActionLoading(true);

            await markAllNotificationsAsRead();

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    read: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error.message
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleNotificationClick = async (
        notification
    ) => {
        if (!notification.read) {
            await handleMarkAsRead(notification._id);
        }

        if (notification.project?._id) {
            navigate(
                `/projects/${notification.project._id}`
            );
        }
    };

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter(
                  (notification) => !notification.read
              )
            : notifications;

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-[1100px]">
                {/* Header */}
                <section className="animate-fade-up">
                    <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

                        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-3 py-1.5">
                                    <Bell
                                        size={12}
                                        className="text-violet-300"
                                    />

                                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-300/70">
                                        Updates
                                    </span>
                                </div>

                                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    Notifications
                                </h1>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
                                    Stay updated with your
                                    projects, teams and
                                    collaboration activity.
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <div className="flex shrink-0 items-center gap-3">
                                    <div className="rounded-xl border border-violet-400/10 bg-violet-500/[0.06] px-4 py-3 text-center">
                                        <p className="text-lg font-black text-violet-300">
                                            {unreadCount}
                                        </p>

                                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/25">
                                            Unread
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-4 py-3 text-xs text-red-300">
                        {error}
                    </div>
                )}

                {/* Controls */}
                <section className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex w-fit items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                        <button
                            type="button"
                            onClick={() => setFilter("all")}
                            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                                filter === "all"
                                    ? "bg-violet-500/[0.12] text-violet-300"
                                    : "text-white/35 hover:text-white/70"
                            }`}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setFilter("unread")
                            }
                            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                                filter === "unread"
                                    ? "bg-violet-500/[0.12] text-violet-300"
                                    : "text-white/35 hover:text-white/70"
                            }`}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span className="ml-2 rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[9px] text-violet-300">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        disabled={
                            unreadCount === 0 ||
                            actionLoading
                        }
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-white/45 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.05] hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <CheckCheck size={15} />

                        Mark all as read
                    </button>
                </section>

                {/* Notifications */}
                <section className="mt-5">
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-28 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                                />
                            ))}
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {filteredNotifications.map(
                                (notification) => {
                                    const {
                                        icon: Icon,
                                        className,
                                    } =
                                        getNotificationIcon(
                                            notification.type
                                        );

                                    return (
                                        <div
                                            key={
                                                notification._id
                                            }
                                            className={`group relative rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                                                notification.read
                                                    ? "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]"
                                                    : "border-violet-400/10 bg-violet-500/[0.035] hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                                            }`}
                                        >
                                            {!notification.read && (
                                                <span className="absolute left-0 top-5 h-8 w-0.5 rounded-r-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.7)]" />
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleNotificationClick(
                                                            notification
                                                        )
                                                    }
                                                    className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border ${className}`}
                                                >
                                                    <Icon
                                                        size={19}
                                                    />
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleNotificationClick(
                                                                notification
                                                            )
                                                        }
                                                        className="block w-full cursor-pointer text-left"
                                                    >
                                                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                                            <h3
                                                                className={`text-sm font-bold ${
                                                                    notification.read
                                                                        ? "text-white/65"
                                                                        : "text-white/85"
                                                                }`}
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </h3>

                                                            <span className="flex shrink-0 items-center gap-1 text-[10px] text-white/20">
                                                                <Clock
                                                                    size={
                                                                        11
                                                                    }
                                                                />

                                                                {formatTime(
                                                                    notification.createdAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1.5 text-xs leading-5 text-white/35">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        {notification.project?.title && (
                                                            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-violet-300/50">
                                                                <FolderKanban
                                                                    size={
                                                                        12
                                                                    }
                                                                />

                                                                {
                                                                    notification
                                                                        .project
                                                                        .title
                                                                }
                                                            </div>
                                                        )}
                                                    </button>
                                                </div>

                                                {!notification.read && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                        disabled={
                                                            actionLoading
                                                        }
                                                        className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 self-start rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 text-[10px] font-semibold text-white/30 transition-all hover:border-violet-400/15 hover:bg-violet-500/[0.06] hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-30"
                                                        title="Mark as read"
                                                    >
                                                        <Check
                                                            size={
                                                                13
                                                            }
                                                        />

                                                        <span className="hidden sm:inline">
                                                            Read
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.015] px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.05]">
                                <Bell
                                    size={24}
                                    className="text-violet-300/50"
                                />
                            </div>

                            <h2 className="mt-5 text-base font-bold text-white/65">
                                {filter === "unread"
                                    ? "You're all caught up"
                                    : "No notifications yet"}
                            </h2>

                            <p className="mt-2 max-w-sm text-xs leading-5 text-white/25">
                                {filter === "unread"
                                    ? "You don't have any unread notifications right now."
                                    : "Project updates, team activity and task assignments will appear here."}
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;