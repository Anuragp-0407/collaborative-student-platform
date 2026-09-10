const StatCard = ({
    label,
    value,
    description,
    icon: Icon,
    accent = "violet",
}) => {
    const accentClasses = {
        violet: {
            icon: "text-violet-300 bg-violet-500/10 border-violet-400/15",
            glow: "bg-violet-500/10",
        },
        fuchsia: {
            icon: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-400/15",
            glow: "bg-fuchsia-500/10",
        },
        cyan: {
            icon: "text-cyan-300 bg-cyan-500/10 border-cyan-400/15",
            glow: "bg-cyan-500/10",
        },
        emerald: {
            icon: "text-emerald-300 bg-emerald-500/10 border-emerald-400/15",
            glow: "bg-emerald-500/10",
        },
    };

    const currentAccent = accentClasses[accent] || accentClasses.violet;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-violet-950/10">
            <div
                className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${currentAccent.glow}`}
            />

            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                        {label}
                    </p>

                    <p className="mt-3 text-3xl font-black tracking-tight text-white">
                        {value}
                    </p>

                    <p className="mt-1 text-[11px] text-white/25">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${currentAccent.icon}`}
                >
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;