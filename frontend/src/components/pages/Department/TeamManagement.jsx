import { useState, useEffect } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import { Plus, MapPin } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
const TeamManagement = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [operators, setOperators] = useState([]);
    const [operatorDetails, setOperatorDetails] = useState(null);
    const [operatorStats, setOperatorStats] = useState(null);
    const [selectedOperator, setSelectedOperator] = useState(null);
    const token = localStorage.getItem("token");

    /* ================= FETCH OPERATORS ================= */
    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/departments/operators`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                setOperators(res.data);
            } catch (err) {
                toast.error("Failed to load operators");
            }
        };

        fetchOperators();
    }, []);

    /* ================= FETCH OPERATOR DETAILS ================= */
    const fetchOperatorDetails = async (id) => {
        try {
            const token = localStorage.getItem("token");

            const profileRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/operator/department/operator/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            const statsRes = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/operator/department/operator/${id}/stats`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            setOperatorDetails(profileRes.data);
            setOperatorStats(statsRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= FILTER ================= */
    const filteredOperators = operators.filter((op) => {
        const percent =
            ((op.currentActiveTasks || 0) / (op.maxCapacity || 1)) * 100;

        if (activeTab === "High") return percent >= 80; // high workload
        if (activeTab === "Available") return percent < 50; // free operators

        return true; // All
    });

    return (
        <DepartmentLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Department Operators</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage workload and performance for service teams
                        </p>
                    </div>

                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
                        <Plus size={16} />
                        Add New Operator
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border pb-2 text-sm">
                    {["All", "High", "Available"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab
                                ? "text-primary border-b-2 border-primary pb-1 font-bold"
                                : "text-muted-foreground hover:text-foreground transition-colors"
                                }`}
                        >
                            {tab} {tab === "All" ? `(${operators.length})` : tab === "High" ? "Workload" : ""}
                        </button>
                    ))}
                </div>

                {/* Operator Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {filteredOperators.map((op) => {
                        const workloadPercent =
                            ((op.currentActiveTasks || 0) / (op.maxCapacity || 1)) * 100;

                        return (
                            <div
                                key={op._id}
                                className={`bg-card border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-xl hover:-translate-y-1
 ${workloadPercent >= 80
                                        ? "border-warning ring-1 ring-warning/20"
                                        : "border-border hover:border-primary/50"
                                    }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`relative h-48 flex items-center justify-center text-4xl font-extrabold tracking-tighter
 ${workloadPercent >= 80 ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}
 `}
                                >
                                    {op.fullName
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}

                                    {/* Status Indicator */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-2 py-1 rounded-full border border-border shadow-sm">
                                        <div className={`w-2 h-2 rounded-full ${op.status === "active" ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                                        <span className="text-[10px] font-black tracking-widest text-foreground">
                                            {op.status}
                                        </span>
                                    </div>

                                    {/* Warning Badge */}
                                    {workloadPercent >= 80 && (
                                        <span className="absolute top-4 left-4 px-2 py-1 text-[8px] font-black tracking-widest rounded-md bg-warning text-warning-foreground shadow-lg">
                                            CRITICAL LOAD
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-foreground  ">{op.fullName}</h3>
                                        <div className="flex items-center gap-1 text-[10px] bg-warning/10 text-warning px-2 py-1 rounded-md font-black shadow-sm">
                                            ⭐ {op.ratingAverage ? op.ratingAverage.toFixed(1) : "NEW"}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin size={14} className="text-primary" />
                                            {op.assignedZone?.zoneName || "Unassigned"}
                                        </div>
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/10">
                                            TRUST: {op.trustScore || 50}
                                        </span>
                                    </div>

                                    {/* Workload Metric */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black text-muted-foreground tracking-widest">
                                            <span>Task Saturation</span>
                                            <span className={workloadPercent >= 80 ? "text-warning" : "text-primary"}>
                                                {op.currentActiveTasks} / {op.maxCapacity}
                                            </span>
                                        </div>

                                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${workloadPercent >= 80
                                                    ? "bg-warning"
                                                    : "bg-primary"
                                                    }`}
                                                style={{
                                                    width: `${workloadPercent}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedOperator(op._id);
                                            fetchOperatorDetails(op._id);
                                        }}
                                        className="w-full mt-2 bg-background border border-border rounded-xl py-3 text-xs font-black tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                                    >
                                        Intelligence Report
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Emergency Portal */}
                <div className="fixed bottom-8 right-8 z-40 group">
                    <button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        Emergency Alert
                    </button>
                </div>
            </div>

            {/* Operator Intelligence Modal */}
            {selectedOperator && operatorDetails && operatorStats && (
                <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        {/* Header Background Accent */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-indigo-500/10" />

                        <button
                            onClick={() => {
                                setSelectedOperator(null);
                                setOperatorDetails(null);
                                setOperatorStats(null);
                            }}
                            className="absolute top-6 right-6 p-2 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground transition-all z-10"
                        >
                            <Plus size={20} className="rotate-45" />
                        </button>

                        <div className="p-8 relative">
                            {/* PROFILE HEADER */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 bg-primary/20 text-primary rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">
                                    {operatorDetails.fullName
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-foreground   tracking-tight">
                                        {operatorDetails.fullName}
                                    </h2>
                                    <p className="text-muted-foreground font-medium text-sm">{operatorDetails.email}</p>
                                </div>
                            </div>

                            {/* CREDENTIAL TAGS */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-2 border ${operatorDetails.status === "active"
                                    ? "bg-success/5 text-success border-success/20"
                                    : "bg-muted text-muted-foreground border-border"
                                    }`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${operatorDetails.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
                                    {operatorDetails.status}
                                </div>

                                <div className="bg-primary/5 text-primary border border-primary/20 px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest">
                                    {operatorDetails.assignedZone?.zoneName || "Sector Pending"}
                                </div>

                                <div className="bg-warning/5 text-warning border border-warning/20 px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-2">
                                    ⭐ {operatorDetails.ratingAverage ? operatorDetails.ratingAverage.toFixed(1) : "Unrated"}
                                    <span className="opacity-50 font-medium">({operatorDetails.totalRatings || 0})</span>
                                </div>

                                <div className="bg-indigo-500/5 text-indigo-500 border border-indigo-500/20 px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest">
                                    Trust Index: {operatorDetails.trustScore || 50}
                                </div>
                            </div>

                            {/* MISSION STATISTICS */}
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {[
                                    { label: "Aggregate", val: operatorStats.total, color: "text-foreground" },
                                    { label: "Dispatching", val: operatorStats.pending, color: "text-warning" },
                                    { label: "Active", val: operatorStats.inProgress, color: "text-primary" },
                                    { label: "Resolution", val: operatorStats.completed, color: "text-success" },
                                ].map((s, i) => (
                                    <div key={i} className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-center group hover:bg-muted/50 transition-colors">
                                        <p className="text-[8px] font-black text-muted-foreground tracking-[0.2em] mb-2">{s.label}</p>
                                        <h3 className={`text-2xl font-black ${s.color}`}>{s.val}</h3>
                                    </div>
                                ))}
                            </div>

                            {/* WORKLOAD VISUALIZER */}
                            <div className="space-y-4 bg-muted/20 p-6 rounded-3xl border border-border/50">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground tracking-widest mb-1">Operational Capacity</p>
                                        <p className="text-xl font-bold text-foreground">
                                            {Math.round((operatorDetails.currentActiveTasks / operatorDetails.maxCapacity) * 100)}% Saturation
                                        </p>
                                    </div>
                                    <p className="text-xs font-black text-primary ">
                                        {operatorDetails.currentActiveTasks} / {operatorDetails.maxCapacity} Slots
                                    </p>
                                </div>

                                <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border shadow-inner">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                        style={{ width: `${(operatorDetails.currentActiveTasks / operatorDetails.maxCapacity) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* ANALYTICS FOOTER */}
                            <div className="mt-8 flex justify-between items-center bg-foreground/5 p-4 rounded-xl border border-foreground/5 border-dashed">
                                <p className="text-[10px] font-black text-muted-foreground tracking-widest">Historical Performance Index</p>
                                <p className="text-lg font-black text-primary  ">
                                    {operatorStats.total > 0
                                        ? Math.round((operatorStats.completed / operatorStats.total) * 100)
                                        : 0}
                                    % EFFICIENCY
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DepartmentLayout>
    );
};

export default TeamManagement;


