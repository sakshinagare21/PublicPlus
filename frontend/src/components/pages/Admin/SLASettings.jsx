import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SLASettings() {
    const [priority, setPriority] = useState("critical");
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // 🔥 NEW STATE
    const [allSLA, setAllSLA] = useState([]);

    /* ================= FETCH SINGLE SLA ================= */
    useEffect(() => {
        fetchSLA();
        fetchAllSLA(); // 🔥 also fetch table data
    }, [priority]);

    const fetchSLA = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token"); // or firebase token

            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/sla/get-sla?priority=${priority}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await res.json();

            if (data.success && data.sla) {
                setLevels(data.sla.levels || []);
                setLastUpdated(data.sla.updatedAt);
            } else {
                setLevels([{ level: 1, value: 2, unit: "hours" }]);
                setLastUpdated(null);
            }
        } catch (err) {
            toast.error("Failed to load SLA");
        } finally {
            setLoading(false);
        }
    };

    /* ================= FETCH ALL SLA ================= */
    const fetchAllSLA = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sla/get-sla`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setAllSLA(data.sla || []);
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error("Failed to load SLA table");
        }
    };

    /* ================= UPDATE LEVEL ================= */
    const updateLevel = (i, key, value) => {
        const updated = [...levels];
        updated[i][key] = value;
        setLevels(updated);
    };

    /* ================= ADD LEVEL ================= */
    const addLevel = () => {
        setLevels([
            ...levels,
            {
                level: levels.length + 1,
                value: 1,
                unit: "days",
            },
        ]);
    };

    /* ================= DELETE LEVEL ================= */
    const deleteLevel = (index) => {
        const updated = levels.filter((_, i) => i !== index);
        const fixed = updated.map((lvl, i) => ({
            ...lvl,
            level: i + 1,
        }));
        setLevels(fixed);
    };

    /* ================= SAVE SLA ================= */
    const saveSLA = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token"); // 🔥 get token

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sla/set-sla`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // 🔥 ADD THIS
                },
                body: JSON.stringify({
                    priority,
                    levels,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("SLA Updated Successfully");
                fetchSLA();
                fetchAllSLA();
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error("Error saving SLA");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 transition-colors">
            {/* HEADER */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">SLA Configuration</h2>
                <p className="text-muted-foreground text-sm">
                    Define escalation timing rules for each priority level
                </p>

                {lastUpdated && (
                    <p className="text-xs text-muted-foreground/60 mt-1  ">
                        Last updated: {new Date(lastUpdated).toLocaleString()}
                    </p>
                )}
            </div>

            {/* ================= FORM CARD ================= */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm transition-colors">
                {/* PRIORITY */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground">Select Priority</label>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full mt-2 bg-muted/30 border border-border rounded-lg p-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {loading && <p className="text-primary text-sm animate-pulse">Loading SLA...</p>}

                {!loading && (
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground/80">Escalation Levels</h3>

                        {levels.map((lvl, i) => (
                            <div
                                key={i}
                                className="flex gap-4 items-center mb-4 bg-muted/20 p-4 rounded-xl border border-border transition-all hover:bg-muted/30"
                            >
                                <div className="flex flex-col gap-1 w-24">
                                    <span className="text-[10px] font-bold text-muted-foreground/60">Stage</span>
                                    <span className="text-sm font-bold text-foreground">
                                        Level {lvl.level}
                                    </span>
                                </div>

                                <div className="flex-1 flex gap-3">
                                    <input
                                        type="number"
                                        value={lvl.value}
                                        onChange={(e) =>
                                            updateLevel(i, "value", Number(e.target.value))
                                        }
                                        className="w-24 bg-background border border-border px-3 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />

                                    <select
                                        value={lvl.unit}
                                        onChange={(e) => updateLevel(i, "unit", e.target.value)}
                                        className="bg-background border border-border px-3 py-2 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    >
                                        <option value="minutes">Minutes</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => deleteLevel(i)}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    aria-label="Remove level"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 pt-2">
                    <button
                        onClick={addLevel}
                        className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow shadow-primary/10"
                    >
                        + Add Level
                    </button>

                    <button
                        onClick={saveSLA}
                        disabled={loading}
                        className="bg-primary text-white hover:opacity-90 px-6 py-2.5 rounded-xl text-sm font-bold flex-1 transition-all shadow-glow shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save SLA"}
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm transition-colors overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-xl font-bold mb-6 text-foreground tracking-tight">SLA Configuration</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-muted-foreground/50 border-b border-border text-[10px] font-black tracking-widest">
                                <th className="py-4 text-left px-4">Priority</th>
                                <th className="py-4 text-left px-4">Escalation Levels</th>
                                <th className="py-4 text-left px-4">Last Updated</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allSLA.map((sla, i) => (
                                <tr key={i} className="border-b border-border/50 transition-colors hover:bg-muted/5 group">
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${sla.priority === 'critical' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                            sla.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                'bg-primary/10 text-primary border border-primary/20'
                                            }`}>
                                            {sla.priority}
                                        </span>
                                    </td>

                                    <td className="py-4 px-4">
                                        <div className="flex flex-wrap gap-2">
                                            {sla.levels.map((lvl) => (
                                                <div key={lvl.level} className="bg-muted px-3 py-1 rounded-lg text-xs font-medium border border-border/50">
                                                    <span className="text-primary font-bold mr-1">L{lvl.level}:</span> {lvl.value} {lvl.unit}
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    <td className="py-4 px-4 text-muted-foreground/60   text-xs">
                                        {sla.updatedAt
                                            ? new Date(sla.updatedAt).toLocaleString()
                                            : "Not available"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


