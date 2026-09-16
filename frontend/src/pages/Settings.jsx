import { useEffect, useState } from "react";
import {
    Check,
    ChevronRight,
    LogOut,
    Shield,
    UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import {
    getCurrentUser,
    changePassword,
} from "../services/userService";

function Settings() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getCurrentUser();

                if (response?.user) {
                    setUser(response.user);
                }
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                        "Failed to load account information."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPasswordError("");
        setPasswordSuccess("");
    };

    const handleCancelPasswordChange = () => {
        setShowPasswordForm(false);

        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setPasswordError("");
        setPasswordSuccess("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        setPasswordError("");
        setPasswordSuccess("");

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = passwordData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("All password fields are required.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters long."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(
                "New password and confirm password do not match."
            );
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError(
                "New password must be different from current password."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const response = await changePassword(passwordData);

            if (response?.success) {
                setPasswordSuccess(
                    "Password changed successfully. Redirecting to login..."
                );

                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    logout();
                    navigate("/login");
                }, 1500);
            }
        } catch (err) {
            setPasswordError(
                err?.response?.data?.message ||
                    "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-full bg-[#08080d] px-4 py-6 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                            <Shield className="h-5 w-5 text-violet-300" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Settings
                            </h1>

                            <p className="text-sm text-white/40">
                                Manage your account and session settings.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* Account */}
                <section className="mb-6">
                    <div className="mb-3">
                        <h2 className="text-sm font-medium text-white/80">
                            Account
                        </h2>

                        <p className="mt-1 text-xs text-white/35">
                            Your basic account information.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                        {/* User information */}
                        <div className="flex items-center gap-4 border-b border-white/[0.06] p-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                {loading ? (
                                    <>
                                        <div className="mb-2 h-4 w-32 animate-pulse rounded bg-white/10" />
                                        <div className="h-3 w-48 animate-pulse rounded bg-white/5" />
                                    </>
                                ) : (
                                    <>
                                        <p className="truncate text-sm font-medium text-white">
                                            {user?.name || "User"}
                                        </p>

                                        <p className="truncate text-xs text-white/40">
                                            {user?.email ||
                                                "No email available"}
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="hidden items-center gap-2 rounded-lg border border-emerald-400/10 bg-emerald-500/[0.06] px-3 py-1.5 sm:flex">
                                <Check className="h-3.5 w-3.5 text-emerald-300" />

                                <span className="text-xs text-emerald-300">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Profile */}
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="flex w-full cursor-pointer items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.025]"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                                <UserRound className="h-4 w-4 text-white/50" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white/85">
                                    Profile
                                </p>

                                <p className="mt-1 text-xs text-white/35">
                                    Update your bio, skills, interests and
                                    social links.
                                </p>
                            </div>

                            <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
                        </button>
                    </div>
                </section>

                {/* Security */}
                <section className="mb-6">
                    <div className="mb-3">
                        <h2 className="text-sm font-medium text-white/80">
                            Security
                        </h2>

                        <p className="mt-1 text-xs text-white/35">
                            Manage your password and authentication.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                        {/* Authentication status */}
                        <div className="flex items-center gap-4 border-b border-white/[0.06] p-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                                <Shield className="h-4 w-4 text-white/50" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white/85">
                                    Authentication
                                </p>

                                <p className="mt-1 text-xs text-white/35">
                                    Your account is protected using JWT-based
                                    authentication.
                                </p>
                            </div>

                            <div className="rounded-lg border border-emerald-400/10 bg-emerald-500/[0.06] px-3 py-1.5">
                                <span className="text-xs text-emerald-300">
                                    Secured
                                </span>
                            </div>
                        </div>

                        {/* Change Password Trigger / Form */}
                        {!showPasswordForm ? (
                            <div className="flex items-center gap-4 p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
                                    <Shield className="h-4 w-4 text-white/50" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-white/85">
                                        Change Password
                                    </p>

                                    <p className="mt-1 text-xs text-white/35">
                                        Update your password to keep your
                                        account secure.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowPasswordForm(true)}
                                    className="cursor-pointer rounded-xl border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2.5 text-sm font-medium text-violet-200 transition-all duration-200 hover:border-violet-400/30 hover:bg-violet-500/[0.14]"
                                >
                                    Change Password
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleChangePassword}
                                className="border-t border-white/[0.06] p-5"
                            >
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-white/85">
                                            Change Password
                                        </h3>

                                        <p className="mt-1 text-xs text-white/35">
                                            Update your password to keep your
                                            account secure.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCancelPasswordChange
                                        }
                                        className="cursor-pointer text-xs text-white/35 transition-colors hover:text-white/70"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {passwordError && (
                                    <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                                        {passwordError}
                                    </div>
                                )}

                                {passwordSuccess && (
                                    <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-300">
                                        {passwordSuccess}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {/* Current Password */}
                                    <div>
                                        <label
                                            htmlFor="currentPassword"
                                            className="mb-2 block text-xs font-medium text-white/55"
                                        >
                                            Current Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    passwordData.currentPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Enter current password"
                                                autoComplete="current-password"
                                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 pr-20 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/30 focus:bg-white/[0.04]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        (previous) => !previous
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-white/35 transition-colors hover:text-white/70"
                                            >
                                                {showCurrentPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="mb-2 block text-xs font-medium text-white/55"
                                        >
                                            New Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                name="newPassword"
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    passwordData.newPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 pr-20 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/30 focus:bg-white/[0.04]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (previous) => !previous
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-white/35 transition-colors hover:text-white/70"
                                            >
                                                {showNewPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>
                                        </div>

                                        <p className="mt-2 text-xs text-white/25">
                                            Minimum 6 characters.
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="mb-2 block text-xs font-medium text-white/55"
                                        >
                                            Confirm New Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 pr-20 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/30 focus:bg-white/[0.04]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (previous) => !previous
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs text-white/35 transition-colors hover:text-white/70"
                                            >
                                                {showConfirmPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={
                                            handleCancelPasswordChange
                                        }
                                        className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.05] hover:text-white/80"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="cursor-pointer rounded-xl border border-violet-400/20 bg-violet-500/[0.08] px-5 py-2.5 text-sm font-medium text-violet-200 transition-all duration-200 hover:border-violet-400/30 hover:bg-violet-500/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {passwordLoading
                                            ? "Changing..."
                                            : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>

                {/* Session */}
                <section className="mb-6">
                    <div className="mb-3">
                        <h2 className="text-sm font-medium text-white/80">
                            Session
                        </h2>

                        <p className="mt-1 text-xs text-white/35">
                            Manage your current login session.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/[0.05]">
                                <LogOut className="h-4 w-4 text-red-300" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium text-white/85">
                                    Log out
                                </p>

                                <p className="mt-1 text-xs text-white/35">
                                    End your current session on this device.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="cursor-pointer rounded-xl border border-red-400/15 bg-red-500/[0.06] px-4 py-2.5 text-sm font-medium text-red-300 transition-all duration-200 hover:border-red-400/25 hover:bg-red-500/[0.1]"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="border-t border-white/[0.05] pt-6">
                    <p className="text-center text-xs text-white/20">
                        Student Collaborator
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Settings;