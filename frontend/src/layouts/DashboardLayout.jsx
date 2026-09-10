import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#080611] text-white">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <div className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
                    <Sidebar />
                </div>
            )}

            {/* Main Content */}
            <div className="min-h-screen lg:pl-72">
                <Topbar
                    onMenuClick={() =>
                        setMobileMenuOpen((previous) => !previous)
                    }
                />

                <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
                    {/* Technical grid */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />

                    {/* Background glow */}
                    <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-700/[0.08] blur-3xl" />

                    {/* Page */}
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;