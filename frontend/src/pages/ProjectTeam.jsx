import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Check,
    Clock3,
    Mail,
    User,
    Users,
    X,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import {
    getProjectById,
    getProjectJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,
} from "../services/projectService";

const ProjectTeam = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [joinRequests, setJoinRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [requestsLoading, setRequestsLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [requestsError, setRequestsError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);
    const [actionError, setActionError] = useState("");

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
        const fetchJoinRequests = async () => {
            try {
                setRequestsLoading(true);
                setRequestsError("");

                const data =
                    await getProjectJoinRequests(projectId);

                setJoinRequests(data.joinRequests || []);
            } catch (error) {
                console.error(
                    "Get join requests error:",
                    error.message
                );

                /*
                 * Non-owners receive 403 from the backend.
                 * We don't show that as a page-level error because
                 * normal team members should still be able to
                 * see the team.
                 */
                if (error.response?.status !== 403) {
                    setRequestsError(
                        error.response?.data?.message ||
                            "Unable to load join requests."
                    );
                }
            } finally {
                setRequestsLoading(false);
            }
        };

        fetchJoinRequests();
    }, [projectId]);

    const handleAccept = async (requestId) => {
        try {
            setActionLoading(requestId);
            setActionError("");

            await acceptJoinRequest(requestId);

            /*
             * Remove the accepted request from the pending list.
             */
            setJoinRequests((previousRequests) =>
                previousRequests.filter(
                    (request) =>
                        request._id !== requestId
                )
            );

            /*
             * Refresh project so the newly accepted member
             * appears immediately in the team list.
             */
            const data = await getProjectById(projectId);

            setProject(data.project);
        } catch (error) {
            console.error(
                "Accept join request error:",
                error.message
            );

            setActionError(
                error.response?.data?.message ||
                    "Unable to accept this request."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId) => {
        try {
            setActionLoading(requestId);
            setActionError("");

            await rejectJoinRequest(requestId);

            /*
             * Remove rejected request from the pending list.
             */
            setJoinRequests((previousRequests) =>
                previousRequests.filter(
                    (request) =>
                        request._id !== requestId
                )
            );
        } catch (error) {
            console.error(
                "Reject join request error:",
                error.message
            );

            setActionError(
                error.response?.data?.message ||
                    "Unable to reject this request."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const pendingRequests = joinRequests.filter(
        (request) => request.status === "pending"
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex items-center gap-3 text-sm text-white/40">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
                        Loading team...
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
                        Unable to load team
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
            <div className="mx-auto max-w-6xl">
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
                <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.08] blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300/60">
                                    Project Team
                                </p>

                                <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                                    {project.title}
                                </h1>

                                <p className="mt-2 text-xs text-white/30">
                                    Manage your project members
                                    and incoming join requests.
                                </p>
                            </div>

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/[0.07]">
                                <Users
                                    size={25}
                                    className="text-violet-300"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2">
                                <Users
                                    size={14}
                                    className="text-fuchsia-300"
                                />

                                <span className="text-xs text-white/45">
                                    {project.members?.length ||
                                        0}{" "}
                                    / {project.maxTeamSize}{" "}
                                    members
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/10 px-3 py-2">
                                <Clock3
                                    size={14}
                                    className="text-amber-300"
                                />

                                <span className="text-xs text-white/45">
                                    {pendingRequests.length}{" "}
                                    pending request
                                    {pendingRequests.length !==
                                    1
                                        ? "s"
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Current Team */}
                <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold">
                                Team Members
                            </h2>

                            <p className="mt-1 text-[11px] text-white/25">
                                Students currently working on
                                this project.
                            </p>
                        </div>

                        <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold text-white/35">
                            {project.members?.length || 0}/
                            {project.maxTeamSize}
                        </span>
                    </div>

                    {project.members?.length > 0 ? (
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {project.members.map((member) => {
                                const memberUser =
                                    member.user;

                                return (
                                    <div
                                        key={
                                            memberUser?._id ||
                                            memberUser
                                        }
                                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/10 p-4"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/[0.07]">
                                                {memberUser?.profileImage ? (
                                                    <img
                                                        src={
                                                            memberUser.profileImage
                                                        }
                                                        alt={
                                                            memberUser.name ||
                                                            "Member"
                                                        }
                                                        className="h-full w-full rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <User
                                                        size={17}
                                                        className="text-violet-300"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-bold text-white/70">
                                                    {memberUser?.name ||
                                                        "Unknown user"}
                                                </p>

                                                <div className="mt-1 flex items-center gap-1.5">
                                                    <Mail
                                                        size={10}
                                                        className="text-white/20"
                                                    />

                                                    <p className="truncate text-[10px] text-white/25">
                                                        {memberUser?.email ||
                                                            ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="ml-3 shrink-0 rounded-lg border border-violet-400/10 bg-violet-500/[0.05] px-2 py-1 text-[9px] font-semibold text-violet-300/70">
                                            {member.role}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mt-5 rounded-xl border border-dashed border-white/[0.08] p-8 text-center">
                            <Users
                                size={22}
                                className="mx-auto text-white/15"
                            />

                            <p className="mt-3 text-xs text-white/30">
                                No team members yet.
                            </p>
                        </div>
                    )}
                </section>

                {/* Join Requests */}
                <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold">
                                    Join Requests
                                </h2>

                                <ShieldCheck
                                    size={15}
                                    className="text-emerald-300/70"
                                />
                            </div>

                            <p className="mt-1 text-[11px] text-white/25">
                                Review students who want to
                                join your project.
                            </p>
                        </div>

                        {pendingRequests.length > 0 && (
                            <span className="w-fit rounded-lg border border-amber-400/15 bg-amber-500/[0.07] px-2.5 py-1 text-[10px] font-semibold text-amber-300">
                                {pendingRequests.length} Pending
                            </span>
                        )}
                    </div>

                    {actionError && (
                        <div className="mt-4 rounded-xl border border-red-400/15 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">
                            {actionError}
                        </div>
                    )}

                    {requestsLoading ? (
                        <div className="mt-5 flex items-center justify-center rounded-xl border border-white/[0.06] py-10">
                            <div className="flex items-center gap-3 text-xs text-white/30">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />
                                Loading requests...
                            </div>
                        </div>
                    ) : requestsError ? (
                        <div className="mt-5 rounded-xl border border-red-400/15 bg-red-500/[0.05] p-5 text-center">
                            <AlertCircle
                                size={20}
                                className="mx-auto text-red-300"
                            />

                            <p className="mt-2 text-xs text-red-300">
                                {requestsError}
                            </p>
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div className="mt-5 rounded-xl border border-dashed border-white/[0.08] p-10 text-center">
                            <Check
                                size={22}
                                className="mx-auto text-emerald-300/50"
                            />

                            <p className="mt-3 text-xs font-semibold text-white/35">
                                No pending join requests
                            </p>

                            <p className="mt-1 text-[10px] text-white/20">
                                New requests will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {pendingRequests.map(
                                (request) => {
                                    const requester =
                                        request.requester;

                                    const isProcessing =
                                        actionLoading ===
                                        request._id;

                                    return (
                                        <div
                                            key={
                                                request._id
                                            }
                                            className="rounded-xl border border-white/[0.07] bg-black/10 p-4"
                                        >
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/15 bg-cyan-500/[0.07]">
                                                        {requester?.profileImage ? (
                                                            <img
                                                                src={
                                                                    requester.profileImage
                                                                }
                                                                alt={
                                                                    requester.name ||
                                                                    "Requester"
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <User
                                                                size={
                                                                    18
                                                                }
                                                                className="text-cyan-300"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-white/70">
                                                            {requester?.name ||
                                                                "Unknown user"}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1.5">
                                                            <Mail
                                                                size={
                                                                    11
                                                                }
                                                                className="text-white/20"
                                                            />

                                                            <span className="text-[10px] text-white/30">
                                                                {requester?.email ||
                                                                    "No email available"}
                                                            </span>
                                                        </div>

                                                        {request.message && (
                                                            <div className="mt-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                                                                <p className="text-[10px] leading-5 text-white/30">
                                                                    "
                                                                    {
                                                                        request.message
                                                                    }
                                                                    "
                                                                </p>
                                                            </div>
                                                        )}

                                                        {requester
                                                            ?.skills
                                                            ?.length >
                                                            0 && (
                                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                                {requester.skills
                                                                    .slice(
                                                                        0,
                                                                        5
                                                                    )
                                                                    .map(
                                                                        (
                                                                            skill
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    skill
                                                                                }
                                                                                className="rounded-md border border-violet-400/10 bg-violet-500/[0.05] px-2 py-1 text-[9px] text-violet-300/70"
                                                                            >
                                                                                {
                                                                                    skill
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        onClick={() =>
                                                            handleReject(
                                                                request._id
                                                            )
                                                        }
                                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-500/[0.05] px-4 py-2.5 text-[11px] font-bold text-red-300 transition-all duration-300 hover:bg-red-500/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <X
                                                            size={
                                                                14
                                                            }
                                                        />
                                                        Reject
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        onClick={() =>
                                                            handleAccept(
                                                                request._id
                                                            )
                                                        }
                                                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.07] px-4 py-2.5 text-[11px] font-bold text-emerald-300 transition-all duration-300 hover:bg-emerald-500/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Check
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {isProcessing
                                                            ? "Processing..."
                                                            : "Accept"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
};

export default ProjectTeam;