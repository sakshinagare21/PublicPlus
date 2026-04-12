import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    Activity,
    Zap,
    MoreVertical,
    ClipboardCheck,
    Eye,
    Camera,
    Calendar,
    X
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
        overdue: 0,
        priorityStats: [],
        logs: []
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
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/operator/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/operator/issue`, {
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

    const statsCards = [
        { label: "OVERDUE TASKS", value: stats.overdue || 0, change: "Requires attention", changeType: "critical", icon: AlertTriangle },
        { label: "ACTIVE MISSIONS", value: stats.inProgress || 0, change: "Current progress", changeType: "neutral", icon: Activity },
        { label: "COMPLETED", value: stats.completed || 0, change: "Successfully handled", changeType: "success", icon: CheckCircle },
    ];

    const tagColors = {
        REPORTED: "text-blue-400",
        ASSIGNED: "text-purple-400",
        IN_PROGRESS: "text-yellow-400",
        RESOLVED: "text-green-400",
        CLOSED: "text-gray-400",
        REOPENED: "text-red-400",
        ESCALATED: "text-orange-500",
    };

    return (
        <OperatorLayout>
            <div className="space-y-6 p-6 bg-background min-h-screen text-foreground font-sans animate-in fade-in duration-500 transition-colors">

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Operator Command</h1>
                    <p className="text-muted-foreground text-sm mt-1">Real-time mission tracking and field oversight.</p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statsCards.map((stat) => (
                        <div key={stat.label} className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 flex justify-between items-center shadow-lg transition-all hover:scale-105 duration-300">
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground tracking-wider font-mono">{stat.label}</p>
                                <p className="text-4xl font-black text-foreground mt-1 drop-shadow-md">{stat.value}</p>
                                <p className={`text-xs mt-2 font-medium flex gap-1 ${stat.changeType === "critical"
                                    ? "text-destructive"
                                    : stat.changeType === "success"
                                        ? "text-success"
                                        : "text-primary"
                                    }`}>
                                    {stat.changeType !== "neutral" && <TrendingUp className="w-3.5 h-3.5" />}
                                    {stat.change}
                                </p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${stat.changeType === "critical" ? "bg-destructive/20 text-destructive border border-destructive/20" :
                                stat.changeType === "success" ? "bg-success/20 text-success border border-success/20" :
                                    "bg-primary/20 text-primary border border-primary/20"
                                }`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Secondary Dashboard Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">

                    {/* Priority Workload (Matching Admin bar chart style) */}
                    <div className="bg-card/60 border border-border rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-foreground mb-6 tracking-wide text-sm flex justify-between items-center uppercase text-muted-foreground">
                            Priority Workload
                            <MoreVertical size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition" />
                        </h3>

                        <div className="space-y-6">
                            {(!stats.priorityStats || stats.priorityStats.length === 0) ? (
                                <p className="text-center text-muted-foreground py-10">Syncing priority distribution...</p>
                            ) : (
                                stats.priorityStats.map((dept) => (
                                    <div key={dept.name} className="relative">
                                        <div className="flex justify-between text-sm font-medium mb-2">
                                            <span className="text-muted-foreground">{dept.name}</span>
                                            <span className="text-foreground">{dept.count} Active</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden border border-border">
                                            <div
                                                className={`${dept.color} h-full rounded-full transition-all duration-1000 ease-out`}
                                                style={{ width: `${dept.load}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* System Intelligence Logs (Operational Logs) */}
                    <div className="bg-card/60 border border-border rounded-2xl p-6 shadow-xl font-mono text-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-foreground tracking-wide text-sm flex items-center gap-2">
                                <Activity size={16} className="text-primary" />
                                System Intelligence Logs
                            </h3>
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {(!stats.logs || stats.logs.length === 0) ? (
                                <p className="text-center text-muted-foreground py-10">No recent activity detected</p>
                            ) : (
                                stats.logs.map((log, i) => (
                                    <div key={i} className="py-2 border-b border-border hover:bg-muted/50 transition px-2 rounded">
                                        <span className="text-muted-foreground text-[10px]">[{log.time}]</span>{" "}
                                        <span className={`font-semibold text-[11px] ${tagColors[log.tag] || "text-muted-foreground"}`}>
                                            {log.tag}:
                                        </span>{" "}
                                        <span className="text-muted-foreground text-[11px]">{log.msg}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* TASK TABLE */}
                <div className="pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <ClipboardCheck className="text-primary" size={24} />
                            Actionable Directives
                        </h2>
                        <button
                            onClick={() => navigate("/operator/tasks")}
                            className="text-xs font-bold text-primary hover:text-foreground tracking-widest uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 transition"
                        >
                            View Full Grid
                        </button>
                    </div>

                    <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                    <tr>
                                        <th className="text-left p-6">Mission Detail</th>
                                        <th className="text-left p-6">Priority</th>
                                        <th className="text-left p-6">SLA Deadline</th>
                                        <th className="text-left p-6">Status</th>
                                        <th className="text-right p-6">Execution</th>
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
                                            <td colSpan={5} className="p-10 text-center text-muted-foreground font-bold tracking-widest opacity-40">
                                                No Critical Directives Detected
                                            </td>
                                        </tr>
                                    ) : priorityTasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-muted/30 group transition-colors">
                                            <td className="p-6">
                                                <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {task.title}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                                                    {task.category?.label || "General Logistics"}
                                                </p>
                                            </td>

                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${getPriorityStyle(task.priority?.level)}`}>
                                                    {task.priority?.level || "Normal"}
                                                </span>
                                            </td>

                                            <td className="p-6">
                                                {task.sla?.resolutionDeadline ? (
                                                    <div className={`flex items-center gap-2 text-[10px] font-bold ${task.sla.isBreached ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}>
                                                        <Clock size={12} />
                                                        {formatDistanceToNow(new Date(task.sla.resolutionDeadline), { addSuffix: true })}
                                                    </div>
                                                ) : "N/A"}
                                            </td>

                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(task.status)}`}>
                                                    {task.status?.replace('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="p-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => openTaskDetail(task)}
                                                        className="p-2 border border-border rounded-xl hover:bg-primary/10 hover:border-primary hover:text-primary transition-all shadow-sm"
                                                        title="Inspect detail"
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
                                                            }`}
                                                        title="Certify Outcome"
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
                                            src={selectedTask.images[0].url.startsWith('http') ? selectedTask.images[0].url : `${import.meta.env.VITE_API_BASE_URL}${selectedTask.images[0].url}`}
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
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Category</p>
                                            <p className="text-sm font-bold text-foreground">{selectedTask.category?.label || "General"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Jurisdiction</p>
                                            <p className="text-sm font-bold text-foreground">
                                                {selectedTask.fullAddress ||
                                                    (selectedTask.location?.coordinates
                                                        ? `Sector [${selectedTask.location.coordinates[1].toFixed(4)}, ${selectedTask.location.coordinates[0].toFixed(4)}]`
                                                        : "N/A")}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2 uppercase">
                                                <Calendar size={12} className="text-primary" />
                                                Assigned At
                                            </p>
                                            <p className="text-sm font-bold text-foreground">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-widest flex items-center gap-2 uppercase">
                                                <Clock size={12} className="text-primary" />
                                                Status
                                            </p>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold border mt-1 uppercase tracking-widest ${getStatusStyle(selectedTask.status)}`}>
                                                {(selectedTask.status || "REPORTED").replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 flex-grow">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Mission Description</p>
                                        <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                                            <p className="text-sm text-foreground leading-relaxed">
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
                                                }`}
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

export default OperatorDashboard;
