import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
    MapPin,
    AlertTriangle,
    Search,
    Zap,
    CheckCircle,
    ArrowRight,
    Shield,
    Activity,
    ClipboardList,
    Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

/* STATUS BADGE COMPONENT */
const StatusBadge = ({ status }) => {
    const configs = {
        "Pending": { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
        "Assigned": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
        "In Progress": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
        "Pending Verification": { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20" },
        "Resolved": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
        "Reopened": { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
        "Escalated": { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
        "Closed": { bg: "bg-slate-500/10", text: "text-slate-500", border: "border-slate-500/20" },
        "default": { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
    };
    const config = configs[status] || configs.default;
    return (
        <span className={`${config.bg} ${config.text} ${config.border} border px-3 py-1 rounded-full text-[10px] font-bold tracking-widest`}>
            {status}
        </span>
    );
};

const OperatorMyTasks = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        inProgress: 0,
        completed: 0,
    });
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const [issuesRes, statsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/issues/operator/issue", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:5000/api/issues/operator/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            const formatted = issuesRes.data.map((issue) => ({
                id: issue._id,
                title: issue.title,
                description: issue.description?.text || "Mission brief pending decryption.",
                images: issue.images || [],
                category: issue.category?.label || "Field Logistics",
                location: issue.fullAddress || (issue.location?.coordinates ? `${issue.location.coordinates[1]}, ${issue.location.coordinates[0]}` : "Location Undefined"),
                status:
                    issue.status === "reported" ? "Pending"
                        : issue.status === "assigned" ? "Assigned"
                            : issue.status === "in_progress" ? "In Progress"
                                : issue.status === "pending_verification" ? "Pending Verification"
                                    : issue.status === "resolved" ? "Resolved"
                                        : issue.status === "reopened" ? "Reopened"
                                            : issue.status === "escalated" ? "Escalated"
                                                : issue.status === "closed" ? "Closed"
                                                    : "Pending",
                priority: issue.priority?.level || "Medium",
                deadline: issue.sla?.resolutionDeadline
                    ? new Date(issue.sla.resolutionDeadline).toLocaleString()
                    : "N/A",
                createdAt: issue.createdAt
            }));

            setTasks(formatted);
            setStats(statsRes.data);

        } catch (err) {
            toast.error("Telemetry sync failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTasks =
        activeTab === "All"
            ? tasks
            : activeTab === "Resolved"
                ? tasks.filter((task) => task.status === "Resolved" || task.status === "Closed")
                : tasks.filter((task) => task.status === activeTab);

    return (
        <OperatorLayout>
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700" style={{ fontFamily: "Calibri, sans-serif" }}>

                {/* TOP LEVEL HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                            All Task
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Active Task
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-3">
                            <Shield size={16} className="text-primary" />
                            <span className="text-[10px] font-bold text-primary tracking-widest">Operator Level 4 Active</span>
                        </div>
                    </div>
                </div>

                {/* TACTICAL STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Pending" value={stats.pending} icon={Target} color="text-amber-500" bg="bg-amber-500/10" />
                    <StatCard title="Active" value={stats.inProgress} icon={Zap} color="text-blue-500" bg="bg-blue-500/10" />
                    <StatCard title="Resolved" value={stats.completed} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
                </div>

                {/* OPERATIONS TOOLBAR */}
                <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex p-1 bg-muted rounded-xl gap-1 overflow-x-auto w-full lg:w-auto">
                        {["All", "Assigned", "In Progress", "Pending Verification", "Resolved", "Escalated"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
                                    ? "bg-background text-primary shadow-sm border"
                                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                    }`}
                            >
                                {tab === "Resolved" ? "Resolved / Closed" : tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-72 group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Search objective records..."
                            className="w-full bg-muted/40 border border-border rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                        />
                    </div>
                </div>

                {/* MISSION REGISTRY TABLE */}
                <div className="bg-card border rounded-2xl shadow-sm overflow-hidden relative">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted/30 border-b">
                                    <th className="p-6 text-[10px] font-bold text-muted-foreground tracking-widest">SR NO</th>
                                    <th className="p-6 text-[10px] font-bold text-muted-foreground tracking-widest">Location</th>
                                    <th className="p-6 text-[10px] font-bold text-muted-foreground tracking-widest">Status</th>
                                    <th className="p-6 text-[10px] font-bold text-muted-foreground tracking-widest text-center">SLA Deadline</th>
                                    <th className="p-6 text-[10px] font-bold text-muted-foreground tracking-widest text-right">Operational Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="p-6 bg-muted/10 h-16" />
                                        </tr>
                                    ))
                                ) : filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-muted/5 transition-all group">
                                        <td className="p-6">
                                            <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{task.title}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium mt-1">ID: #{(task.id.slice(-8)).toUpperCase()}</p>
                                        </td>

                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-muted-foreground" />
                                                <span className="text-xs font-semibold text-muted-foreground/80 truncate max-w-[200px]">{task.location}</span>
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            <StatusBadge status={task.status} />
                                        </td>

                                        <td className="p-6 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg border text-muted-foreground">
                                                <Clock size={12} className="text-primary/70" />
                                                <span className="text-[11px] font-bold">{task.deadline.split(',')[0]}</span>
                                            </div>
                                        </td>

                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => { setSelectedTask(task); setShowModal(true); }}
                                                    className="p-2.5 bg-muted/60 hover:bg-primary/10 rounded-xl text-primary transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/operator/tasks/${task.id}`)}
                                                    className="bg-primary text-white hover:opacity-90 px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest transition-all active:scale-95 shadow-sm flex items-center gap-2"
                                                >
                                                    Execute
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && filteredTasks.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-32 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <Activity size={48} />
                                                <p className="text-sm font-bold tracking-widest  ">Scanning Sector... Zero Data Hits</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center p-6 bg-muted/20 border-t">
                        <p className="text-xs font-bold text-muted-foreground tracking-widest opacity-60">Scanning {tasks.length} Sector Nodes</p>
                        <div className="flex gap-2">
                            <button className="p-2 border rounded-lg hover:bg-background transition shadow-sm"><ChevronLeft size={18} /></button>
                            <button className="p-2 border rounded-lg hover:bg-background transition shadow-sm"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>

                {/* MISSION PROFILE MODAL */}
                {showModal && selectedTask && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="bg-card w-full max-w-[900px] rounded-[2rem] border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 animate-in zoom-in-95 duration-500 overflow-y-auto">
                            <div className="flex flex-col md:flex-row h-full">
                                {/* MODAL VISUAL */}
                                <div className="w-full md:w-5/12 bg-muted relative min-h-[300px]">
                                    {selectedTask.images && selectedTask.images.length > 0 ? (
                                        <img src={`http://localhost:5000${selectedTask.images[0].url}`} className="w-full h-full object-cover" alt="Mission Scan" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                                            <MapPin size={48} />
                                            <p className="text-[10px] font-bold tracking-widest">image</p>
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border text-[10px] font-bold text-foreground">
                                            {selectedTask.priority.toUpperCase()} PRIORITY
                                        </span>
                                    </div>
                                </div>

                                {/* MODAL INTEL */}
                                <div className="w-full md:w-7/12 p-10 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl font-semibold tracking-tight">{selectedTask.title}</h2>
                                                <p className="text-xs font-bold text-muted-foreground tracking-widest mt-1 opacity-60">ID: #{selectedTask.id.slice(-8)}</p>
                                            </div>
                                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-muted-foreground tracking-widest">Category</p>
                                                <p className="text-sm font-bold text-foreground">{selectedTask.category}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-muted-foreground tracking-widest">Location</p>
                                                <p className="text-sm font-bold text-foreground truncate">{selectedTask.location}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-muted-foreground tracking-widest">Description</p>
                                            <div className="p-5 bg-muted/50 rounded-2xl border border-border">
                                                <p className="text-sm text-foreground leading-relaxed   font-medium opacity-80">
                                                    "{selectedTask.description}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t mt-8 flex flex-col gap-3">
                                        <button
                                            onClick={() => navigate(`/operator/tasks/${selectedTask.id}`)}
                                            className="bg-primary text-white py-4 rounded-xl font-bold text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            <ClipboardList size={20} />
                                            Upload proof
                                        </button>
                                        <p className="text-[9px] text-center font-bold text-muted-foreground tracking-widest opacity-40">Protocol execution required within SLA cycle</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </OperatorLayout>
    );
};

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="bg-card border rounded-2xl p-8 flex items-center gap-6 shadow-sm hover:shadow-md transition">
        <div className={`h-14 w-14 rounded-xl ${bg} ${color} flex items-center justify-center`}>
            <Icon size={26} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-4xl font-bold tracking-tighter leading-none">{value}</h3>
        </div>
    </div>
);

export default OperatorMyTasks;
