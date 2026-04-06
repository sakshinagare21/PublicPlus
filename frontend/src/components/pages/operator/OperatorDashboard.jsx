import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
    AlertCircle,
    Clock,
    CheckCircle,
    MapPin,
    MoreVertical,
    Activity,
    Zap,
    X,
    Eye,
    Camera,
    Calendar,
    AlertTriangle,
    ClipboardCheck
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const OperatorDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0
    });
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const [statsRes, tasksRes] = await Promise.all([
                axios.get("http://localhost:5000/api/issues/operator/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("http://localhost:5000/api/issues/operator/issue", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats(statsRes.data);
            const formattedTasks = tasksRes.data.map(task => ({
                ...task,
                description: task.description?.text || "No tactical details provided by reporter."
            }));
            setTasks(formattedTasks);
        } catch (err) {
            console.error("Dashboard data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const priorityTasks = tasks
        .filter(t => t.status !== "resolved" && t.status !== "closed")
        .sort((a, b) => {
            const score = { critical: 4, high: 3, medium: 2, low: 1 };
            return (score[b.priority?.level] || 0) - (score[a.priority?.level] || 0);
        })
        .slice(0, 5);

    const getStatusStyle = (status) => {
        const styles = {
            reported: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            assigned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            in_progress: "bg-primary/10 text-primary border-primary/20 shadow-glow shadow-primary/5",
            resolved: "bg-success/10 text-success border-success/20",
            escalated: "bg-red-500/10 text-red-500 border-red-500/20",
            closed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
            pending_verification: "bg-purple-500/10 text-purple-500 border-purple-500/20"
        };
        return styles[status] || styles.reported;
    };

    const getPriorityStyle = (level) => {
        const styles = {
            critical: "bg-red-500/10 text-red-500 border-red-500/20",
            high: "bg-destructive/10 text-destructive border-destructive/20",
            medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            low: "bg-blue-500/10 text-blue-500 border-blue-500/20"
        };
        return styles[level] || styles.low;
    };

    const openTaskDetail = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    return (
        <OperatorLayout>
            <div className="space-y-8" style={{ fontFamily: "Calibri, sans-serif" }}>

                {/* HEADER */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">
                            Dashboard <span className="text-primary">Overview</span>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            View your tasks and performance
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-sm text-primary px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                        <Activity size={14} />
                        System Active
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <StatCard title="Total Tasks" value={stats.total} />
                    <StatCard title="Pending" value={stats.pending} />
                    <StatCard title="In Progress" value={stats.inProgress} />
                    <StatCard title="Completed" value={stats.completed} />
                    <StatCard title="Overdue" value={stats.overdue} critical />
                </div>

                {/* TASK TABLE */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                            <Zap className="text-primary" size={20} />
                            Priority Tasks
                        </h2>
                        <button
                            onClick={() => navigate("/operator/tasks")}
                            className="text-sm text-primary hover:text-foreground font-bold"
                        >
                            View All Tasks
                        </button>
                    </div>

                    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b border-border text-muted-foreground text-sm font-medium">
                                    <tr>
                                        <th className="text-left p-6">Task Details</th>
                                        <th className="text-left p-6">Priority</th>
                                        <th className="text-left p-6">Deadline</th>
                                        <th className="text-left p-6">Status</th>
                                        <th className="text-right p-6">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-10 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Scanning operational grid...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : priorityTasks.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-10 text-center text-muted-foreground font-bold tracking-widest opacity-40 italic">
                                                No Critical Directives Detected
                                            </td>
                                        </tr>
                                    ) : priorityTasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-muted/30 group">
                                            <td className="p-6">
                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {task.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.category?.label || "General Logistics"}
                                                </p>
                                            </td>

                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPriorityStyle(task.priority?.level)}`}>
                                                    {task.priority?.level || "Normal"}
                                                </span>
                                            </td>

                                            <td className="p-6">
                                                {task.sla?.resolutionDeadline ? (
                                                    <div className={`flex items-center gap-2 text-xs font-bold ${task.sla.isBreached ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}>
                                                        <Clock size={14} />
                                                        {formatDistanceToNow(new Date(task.sla.resolutionDeadline), { addSuffix: true })}
                                                    </div>
                                                ) : "No deadline"}
                                            </td>

                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(task.status)}`}>
                                                    {task.status?.replace('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openTaskDetail(task)}
                                                        className="p-2 border border-border rounded-xl hover:bg-primary/10 hover:border-primary hover:text-primary transition-all shadow-sm"
                                                        title="Inspect mission detail"
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    <button
                                                        disabled={task.status === "resolved" || task.status === "closed"}
                                                        onClick={() => navigate(`/operator/tasks/${task._id}`)}
                                                        className={`p-2 border rounded-xl transition-all shadow-sm
 ${task.status === "resolved" || task.status === "closed"
                                                                ? "border-border text-muted-foreground cursor-not-allowed opacity-30"
                                                                : "border-success/30 text-success hover:bg-success hover:text-white"
                                                            }
 `}
                                                        title="Upload Certification Proof"
                                                    >
                                                        <Camera size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* TASK DETAIL MODAL */}
                {showModal && selectedTask && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowModal(false)}></div>
                        <div className="bg-card w-full max-w-4xl rounded-[3rem] border border-border shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
                            <div className="flex flex-col md:flex-row">
                                {/* Left: Image */}
                                <div className="w-full md:w-1/2 bg-muted relative min-h-[300px]">
                                    {selectedTask.images && selectedTask.images.length > 0 ? (
                                        <img
                                            src={`http://localhost:5000${selectedTask.images[0].url}`}
                                            alt="Issue"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 gap-4">
                                            <AlertTriangle size={64} />
                                            <p className="text-xs font-bold tracking-widest">No Tactical Imagery Found</p>
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-widest bg-background/50 backdrop-blur-md shadow-2xl ${getPriorityStyle(selectedTask.priority?.level)}`}>
                                            PRIORITY: {selectedTask.priority?.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Details */}
                                <div className="w-full md:w-1/2 p-10 space-y-8 flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-3xl font-bold text-foreground leading-tight">{selectedTask.title}</h2>
                                        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Category</p>
                                            <p className="text-sm font-bold text-foreground">{selectedTask.category?.label || "General"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Jurisdiction</p>
                                            <p className="text-sm font-bold text-foreground">
                                                {selectedTask.fullAddress ||
                                                    (selectedTask.location?.coordinates
                                                        ? `Sector [${selectedTask.location.coordinates[1].toFixed(4)}, ${selectedTask.location.coordinates[0].toFixed(4)}]`
                                                        : "N/A")}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                                                <Calendar size={12} className="text-primary" />
                                                Assigned At
                                            </p>
                                            <p className="text-sm font-bold text-foreground">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2">
                                                <Clock size={12} className="text-primary" />
                                                Status
                                            </p>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold border mt-1 ${getStatusStyle(selectedTask.status)}`}>
                                                {(selectedTask.status || "REPORTED").replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex-grow">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Mission Description</p>
                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                            <p className="text-sm text-foreground leading-relaxed italic">
                                                "{selectedTask.description || "No tactical details provided by reporter."}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border flex gap-4">
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                navigate(`/operator/tasks/${selectedTask._id}`);
                                            }}
                                            disabled={selectedTask.status === "resolved" || selectedTask.status === "closed"}
                                            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-[10px] tracking-widest transition-all shadow-xl
 ${selectedTask.status === "resolved" || selectedTask.status === "closed"
                                                    ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                                                    : "bg-success text-white hover:bg-success/90 shadow-success/20 active:scale-95"
                                                }
 `}
                                        >
                                            <Camera size={18} />
                                            Certify Success
                                        </button>
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

/* STAT CARD */
const StatCard = ({ title, value, critical = false }) => {
    return (
        <div className={`bg-card border rounded-[2.5rem] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${critical ? "border-destructive/30 border-dashed" : "border-border shadow-inner"}`}>
            <p className={`text-[10px] font-bold tracking-widest mb-2 ${critical ? "text-destructive" : "text-muted-foreground opacity-60"}`}>
                {title}
            </p>
            <h2 className={`text-3xl font-bold ${critical ? "text-destructive" : "text-foreground"}`}>
                {value}
            </h2>
        </div>
    );
};

export default OperatorDashboard;
