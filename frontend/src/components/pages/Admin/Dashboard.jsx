import { useState, useEffect } from "react";
import axios from "axios";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    Settings as SettingsIcon,
    Eye,
    Activity
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [activeFilter, setActiveFilter] = useState("INFRASTRUCTURE");
    const [stats, setStats] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [aiLogs, setAiLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/admin/stats`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setStats(res.data.stats);
            setDepartments(res.data.departments || []);
            setAiLogs(res.data.logs || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch admin stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                    <Activity className="animate-spin text-primary" size={40} />
                </div>
            </AdminLayout>
        );
    }

    const statsCards = [
        { label: "CRITICAL ISSUES", value: stats.critical || 0, change: "Requires attention", changeType: "critical", icon: AlertTriangle },
        { label: "PENDING", value: stats.pending || 0, change: "Awaiting assignment", changeType: "neutral", icon: Clock },
        { label: "RESOLVED", value: stats.resolved || 0, change: "Successfully handled", changeType: "success", icon: CheckCircle },
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
        <AdminLayout>
            <div className="space-y-6 p-6 bg-background min-h-screen text-foreground font-sans animate-in fade-in duration-500 transition-colors">

                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Command Center</h1>
                    <p className="text-muted-foreground text-sm mt-1">Real-time civic intelligence and system oversight.</p>
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

                    {/* Departments */}
                    <div className="bg-card/60 border border-border rounded-2xl p-6 shadow-xl">
                        <h3 className="font-bold text-foreground mb-6 tracking-wide text-sm flex justify-between items-center">
                            Department Workload
                            <SettingsIcon size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition" />
                        </h3>

                        <div className="space-y-6">
                            {departments.length === 0 ? (
                                <p className="text-center text-muted-foreground py-10">No department data available</p>
                            ) : (
                                departments.map((dept) => (
                                    <div key={dept.name} className="relative">
                                        <div className="flex justify-between text-sm font-medium mb-2">
                                            <span className="text-muted-foreground">{dept.name}</span>
                                            <span className="text-foreground">{dept.load}%</span>
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

                    {/* Logs */}
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

                        <div className="space-y-4">
                            {aiLogs.length === 0 ? (
                                <p className="text-center text-muted-foreground py-10">No recent activity detected</p>
                            ) : (
                                aiLogs.map((log, i) => (
                                    <div key={i} className="py-2 border-b border-border hover:bg-muted/50 transition px-2 rounded">
                                        <span className="text-muted-foreground">[{log.time}]</span>{" "}
                                        <span className={`font-semibold ${tagColors[log.tag] || "text-muted-foreground"}`}>
                                            {log.tag}:
                                        </span>{" "}
                                        <span className="text-muted-foreground">{log.msg}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}


