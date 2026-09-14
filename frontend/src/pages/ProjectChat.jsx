import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Send,
    MessageCircle,
    User,
    AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import DashboardLayout from "../layouts/DashboardLayout";
import {
    getProjectById,
    getProjectMessages,
} from "../services/projectService";

const SOCKET_URL =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

const ProjectChat = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [socketError, setSocketError] = useState("");

    const [sending, setSending] = useState(false);
    const [connected, setConnected] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProjectById(projectId);

                setProject(data.project);
            } catch (error) {
                console.error(
                    "Get project error:",
                    error.message
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load project."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setMessagesLoading(true);
                setSocketError("");

                const data =
                    await getProjectMessages(projectId, {
                        page: 1,
                        limit: 50,
                    });

                /*
                 * Backend returns messages newest first.
                 * Reverse them so the oldest message appears
                 * at the top and newest message at the bottom.
                 */
                setMessages(
                    [...(data.messages || [])].reverse()
                );
            } catch (error) {
                console.error(
                    "Get project messages error:",
                    error.message
                );

                setSocketError(
                    error.response?.data?.message ||
                        "Unable to load project messages."
                );
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();
    }, [projectId]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setSocketError(
                "Authentication required for project chat."
            );

            return;
        }

        const socket = io(SOCKET_URL, {
            auth: {
                token,
            },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);
            setSocketError("");

            socket.emit(
                "joinProjectRoom",
                projectId,
                (response) => {
                    if (!response?.success) {
                        setSocketError(
                            response?.message ||
                                "Unable to join project chat."
                        );

                        return;
                    }

                    setSocketError("");
                }
            );
        });

        socket.on("connect_error", (error) => {
            console.error(
                "Socket connection error:",
                error.message
            );

            setConnected(false);

            setSocketError(
                "Unable to connect to project chat."
            );
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on("newMessage", (newMessage) => {
            /*
             * Only add messages belonging to this project.
             */
            if (
                newMessage?.project?.toString() !==
                    projectId &&
                newMessage?.project?._id !== projectId
            ) {
                return;
            }

            setMessages((previousMessages) => {
                const alreadyExists =
                    previousMessages.some(
                        (message) =>
                            message._id ===
                            newMessage._id
                    );

                if (alreadyExists) {
                    return previousMessages;
                }

                return [
                    ...previousMessages,
                    newMessage,
                ];
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [projectId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const handleSendMessage = (event) => {
        event.preventDefault();

        const trimmedMessage = messageInput.trim();

        if (!trimmedMessage || sending) {
            return;
        }

        const socket = socketRef.current;

        if (!socket || !socket.connected) {
            setSocketError(
                "Chat connection is not available."
            );

            return;
        }

        setSending(true);
        setSocketError("");

        socket.emit(
            "sendMessage",
            {
                projectId,
                message: trimmedMessage,
            },
            (response) => {
                setSending(false);

                if (!response?.success) {
                    setSocketError(
                        response?.message ||
                            "Unable to send message."
                    );

                    return;
                }

                setMessageInput("");
            }
        );
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            handleSendMessage(event);
        }
    };

    const formatMessageTime = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getInitial = (name) => {
        return (
            name?.charAt(0)?.toUpperCase() || "U"
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
                        Unable to load project
                    </h1>

                    <p className="mt-2 max-w-md text-xs leading-5 text-white/30">
                        {error ||
                            "The project could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/projects/${projectId}`
                            )
                        }
                        className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-xs font-bold text-white/50 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-violet-300"
                    >
                        <ArrowLeft size={15} />
                        Back to Project
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl">
                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/projects/${projectId}`
                        )
                    }
                    className="group mb-5 flex cursor-pointer items-center gap-2 text-xs font-semibold text-white/35 transition-colors duration-300 hover:text-violet-300"
                >
                    <ArrowLeft
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    Back to Project
                </button>

                {/* Header */}
                <section className="rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.07]">
                                <MessageCircle
                                    size={20}
                                    className="text-violet-300"
                                />
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-black tracking-tight sm:text-xl">
                                    {project.title}
                                </h1>

                                <div className="mt-1 flex items-center gap-2">
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            connected
                                                ? "bg-emerald-400"
                                                : "bg-white/20"
                                        }`}
                                    />

                                    <span className="text-[10px] text-white/30">
                                        {connected
                                            ? "Connected"
                                            : "Connecting..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <span className="hidden rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/30 sm:block">
                            {project.members?.length ||
                                0}{" "}
                            members
                        </span>
                    </div>
                </section>

                {/* Chat */}
                <section className="mt-5 flex h-[65vh] min-h-[500px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                        {messagesLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="flex items-center gap-3 text-xs text-white/30">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
                                    Loading messages...
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.05]">
                                    <MessageCircle
                                        size={23}
                                        className="text-violet-300/60"
                                    />
                                </div>

                                <h2 className="mt-4 text-sm font-bold text-white/50">
                                    No messages yet
                                </h2>

                                <p className="mt-1 max-w-xs text-[11px] leading-5 text-white/20">
                                    Start the conversation
                                    with your project team.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-violet-400/10 bg-violet-500/[0.05]">
                                            {message.sender
                                                ?.profileImage ? (
                                                <img
                                                    src={
                                                        message
                                                            .sender
                                                            .profileImage
                                                    }
                                                    alt={
                                                        message
                                                            .sender
                                                            .name ||
                                                        "User"
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User
                                                    size={
                                                        14
                                                    }
                                                    className="text-violet-300/70"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 max-w-[85%]">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white/60">
                                                    {message
                                                        .sender
                                                        ?.name ||
                                                        "Unknown user"}
                                                </span>

                                                <span className="text-[9px] text-white/20">
                                                    {formatMessageTime(
                                                        message.createdAt
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-1 rounded-2xl rounded-tl-md border border-white/[0.06] bg-black/10 px-3.5 py-2.5">
                                                <p className="whitespace-pre-wrap break-words text-xs leading-5 text-white/45">
                                                    {
                                                        message.message
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    ref={messagesEndRef}
                                />
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {socketError && (
                        <div className="mx-4 mb-3 rounded-xl border border-red-400/15 bg-red-500/[0.05] px-4 py-2.5 text-xs text-red-300 sm:mx-6">
                            {socketError}
                        </div>
                    )}

                    {/* Composer */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-white/[0.07] bg-black/10 p-3 sm:p-4"
                    >
                        <div className="flex items-end gap-2">
                            <textarea
                                value={messageInput}
                                onChange={(event) =>
                                    setMessageInput(
                                        event.target.value
                                    )
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Write a message..."
                                rows={1}
                                maxLength={2000}
                                disabled={
                                    !connected ||
                                    sending
                                }
                                className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs text-white/70 outline-none placeholder:text-white/20 focus:border-violet-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                            />

                            <button
                                type="submit"
                                disabled={
                                    !messageInput.trim() ||
                                    !connected ||
                                    sending
                                }
                                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.1] text-violet-300 transition-all duration-300 hover:bg-violet-500/[0.17] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <Send size={16} />
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between px-1">
                            <p className="text-[9px] text-white/15">
                                Press Enter to send • Shift +
                                Enter for new line
                            </p>

                            <span className="text-[9px] text-white/15">
                                {messageInput.length}/2000
                            </span>
                        </div>
                    </form>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default ProjectChat;