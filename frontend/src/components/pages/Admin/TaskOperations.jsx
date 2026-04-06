import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    CheckCircle,
    Clock,
    X,
    Eye,
    AlertCircle,
    RotateCcw,
    FileText,
    UserCheck,
    ShieldCheck,
    Flag
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const priorityColors = {
    LOW: "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.3)]",
    MEDIUM: "border-[hsl(var(--primary)/0.3)] text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.05)]",
    HIGH: "border-[hsl(var(--warning)/0.5)] text-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.05)]",
    CRITICAL: "border-[hsl(var(--destructive)/0.5)] text-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)] shadow-[0_0_15px_rgba(var(--destructive),0.1)]",
};

export default function TaskOperations() {
    const [showAudit, setShowAudit] = useState(false);
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({ total: 0, responseTime: "0" });
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [issuesRes, statsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/issues/admin/all", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:5000/api/issues/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (issuesRes.data.success) {
                setIssues(issuesRes.data.issues);
            }
            setStats({
                total: statsRes.data.stats?.total || 0,
                responseTime: "42m",
            });
        } catch (err) {
            console.error("Task Operations Fetch Error:", err);
            toast.error("Failed to update tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const categorized = {
        escalated: issues.filter(i =>
        (i.isEscalated || i.status === "escalated" ||
            (i.sla?.resolutionDeadline && new Date(i.sla?.resolutionDeadline) < new Date() && i.status !== "resolved"))
        ),
        critical: issues.filter(i =>
            i.priority?.level?.toLowerCase() === 'critical' &&
            !(i.isEscalated || i.status === "escalated" || (i.sla?.resolutionDeadline && new Date(i.sla?.resolutionDeadline) < new Date() && i.status !== "resolved"))
        ),
        active: issues.filter(i =>
            !i.isEscalated &&
            i.priority?.level?.toLowerCase() !== 'critical' &&
            ["reported", "assigned", "in_progress", "reopened"].includes(i.status) &&
            !(i.sla?.resolutionDeadline && new Date(i.sla?.resolutionDeadline) < new Date() && i.status !== "resolved")
        ),
    };

    const getTimelineLog = (issue) => {
        if (!issue) return [];

        const logs = [
            {
                stage: "Task Registered",
                event: "Report received",
                time: new Date(issue.createdAt).toLocaleTimeString(),
                detail: `ID: #${issue._id.slice(-6).toUpperCase()}`,
                icon: <FileText size={14} />,
                status: "completed"
            }
        ];

        if (issue.assignedTo || issue.status !== "reported") {
            logs.push({
                stage: "Staff Assigned",
                event: `${issue.assignedDepartment?.departmentName || "Dept"} Dispatched`,
                time: "VERIFIED",
                detail: `Agent: ${issue.assignedTo?.fullName || "Field Staff"}`,
                icon: <Clock size={14} />,
                status: "completed"
            });
        }

        const isSolved = ["pending_verification", "resolved"].includes(issue.status);
        logs.push({
            stage: "Task Resolution",
            event: isSolved ? "Success proof submitted" : "Ongoing work",
            time: isSolved ? "DONE" : "ACTIVE",
            detail: isSolved ? "Waiting for verification" : "Staff at location",
            icon: <UserCheck size={14} />,
            status: isSolved ? "completed" : "active"
        });

        const isVerified = issue.status === "resolved";
        logs.push({
            stage: "Verification",
            event: isVerified ? "Confirmed by user" : "Pending confirmation",
            time: isVerified ? "VERIFIED" : "PENDING",
            detail: isVerified ? "Issue resolved successfully" : "User hasn't replied",
            icon: <ShieldCheck size={14} />,
            status: isVerified ? "completed" : isSolved ? "active" : "pending"
        });

        logs.push({
            stage: "Task Closed",
            event: isVerified ? "Resolved" : "Open Task",
            time: isVerified ? "CLOSED" : "OPEN",
            detail: isVerified ? "Archived record" : "Ongoing grid stay",
            icon: <Flag size={14} />,
            status: isVerified ? "completed" : "pending"
        });

        return logs;
    };

    return (
        <AdminLayout>
            <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 transition-colors duration-200 font-sans">

                {/* Simple Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[hsl(var(--border))]">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))]">
                            Task Status Tracking
                        </h1>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Monitor and manage all reported tasks in the city.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg px-4 py-2">
                            <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] ">Total Tasks</p>
                            <p className="text-lg font-bold text-[hsl(var(--foreground))]">
                                {stats.total.toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={fetchData}
                            className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] rounded-lg p-2.5 transition-all active:scale-95 shadow-sm text-white"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Status columns in flex */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-[hsl(var(--primary)/0.3)] border-t-[hsl(var(--primary))] rounded-full animate-spin" />
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Updating Task List...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin">
                        <div className="flex gap-6 h-full min-w-max pr-4">

                            {/* Active Column */}
                            <div className="w-80 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2 py-1 sticky top-0 bg-[hsl(var(--background))] z-10 border-b border-[hsl(var(--border))]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]" />
                                        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Active Tasks</h2>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-[hsl(var(--secondary))] rounded text-[hsl(var(--muted-foreground))]">
                                        {categorized.active.length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                    {categorized.active.map((issue) => (
                                        <div
                                            key={issue._id}
                                            className={`bg-[hsl(var(--card))] border transition-all rounded-xl p-5 cursor-pointer hover:border-[hsl(var(--primary)/0.5)] ${selectedIssue?._id === issue._id
                                                    ? "border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.2)] shadow-sm"
                                                    : "border-[hsl(var(--border))]"
                                                }`}
                                            onClick={() => {
                                                setSelectedIssue(issue);
                                                setShowAudit(true);
                                            }}
                                        >
                                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1">TASK ID: {issue._id.slice(-6).toUpperCase()}</p>
                                            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] leading-tight mb-3">{issue.title}</h3>

                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${priorityColors[issue.priority?.level?.toUpperCase()] || priorityColors.LOW}`}>
                                                    {issue.priority?.level?.toUpperCase() || "LOW"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-[hsl(var(--border))]">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <ShieldCheck size={14} className="text-[hsl(var(--muted-foreground))]" />
                                                    <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate">
                                                        {issue.assignedDepartment?.departmentName || "Unassigned"}
                                                    </p>
                                                </div>
                                                <Eye size={16} className="text-[hsl(var(--primary))] opacity-50" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Escalated Column */}
                            <div className="w-80 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2 py-1 sticky top-0 bg-[hsl(var(--background))] z-10 border-b border-[hsl(var(--border))]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--destructive))]" />
                                        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Escalated Tasks</h2>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-[hsl(var(--destructive)/0.1)] rounded text-[hsl(var(--destructive))]">
                                        {categorized.escalated.length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                    {categorized.escalated.map((issue) => (
                                        <div
                                            key={issue._id}
                                            className={`bg-[hsl(var(--card))] border transition-all rounded-xl p-5 cursor-pointer hover:border-[hsl(var(--destructive)/0.5)] ${selectedIssue?._id === issue._id
                                                    ? "border-[hsl(var(--destructive))] ring-1 ring-[hsl(var(--destructive)/0.2)] shadow-sm"
                                                    : "border-[hsl(var(--border))]"
                                                }`}
                                            onClick={() => {
                                                setSelectedIssue(issue);
                                                setShowAudit(true);
                                            }}
                                        >
                                            <div className="text-[hsl(var(--destructive))] text-[10px] font-bold mb-1">ESCALATION_TRACK</div>
                                            <p className="text-sm font-semibold text-[hsl(var(--foreground))] leading-tight mb-3">{issue.title}</p>
                                            <div className="flex justify-between items-center pt-3 border-t border-[hsl(var(--border))]">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <AlertCircle size={14} className="text-[hsl(var(--destructive))]" />
                                                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                                                        {issue.isEscalated ? "Flagged" : "Overdue"}
                                                    </p>
                                                </div>
                                                <Eye size={16} className="text-[hsl(var(--primary))] opacity-50" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Urgent (Priority Critical) Column */}
                            <div className="w-80 flex flex-col gap-4">
                                <div className="flex items-center justify-between px-2 py-1 sticky top-0 bg-[hsl(var(--background))] z-10 border-b border-[hsl(var(--border))]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--primary))]" />
                                        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">High Priority</h2>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-0.5 bg-[hsl(var(--secondary))] rounded text-[hsl(var(--muted-foreground))]">
                                        {categorized.critical.length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                                    {categorized.critical.map((issue) => (
                                        <div
                                            key={issue._id}
                                            className={`bg-[hsl(var(--card))] border transition-all rounded-xl p-5 cursor-pointer hover:border-[hsl(var(--primary)/0.5)] ${selectedIssue?._id === issue._id
                                                    ? "border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary)/0.2)] shadow-sm"
                                                    : "border-[hsl(var(--border))]"
                                                }`}
                                            onClick={() => {
                                                setSelectedIssue(issue);
                                                setShowAudit(true);
                                            }}
                                        >
                                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1 ">Task ID: {issue._id.slice(-6).toUpperCase()}</p>
                                            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] leading-tight mb-3">{issue.title}</h3>

                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${priorityColors.CRITICAL}`}>
                                                    CRITICAL
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-[hsl(var(--border))]">
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <ShieldCheck size={14} className="text-[hsl(var(--muted-foreground))]" />
                                                    <p className="text-[11px] text-[hsl(var(--muted-foreground))] truncate">
                                                        {issue.assignedDepartment?.departmentName || "Unassigned"}
                                                    </p>
                                                </div>
                                                <Eye size={16} className="text-[hsl(var(--primary))] opacity-50" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Task Detail Panel */}
                {showAudit && (
                    <div className="fixed inset-y-0 right-0 w-full sm:w-[350px] bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] shadow-2xl z-50 animate-in slide-in-from-right duration-200 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xs font-semibold text-[hsl(var(--primary))] ">Timeline</h3>
                                    <p className="text-xl font-bold text-[hsl(var(--foreground))]">Task Details</p>
                                </div>
                                <button
                                    onClick={() => setShowAudit(false)}
                                    className="p-2 hover:bg-[hsl(var(--secondary))] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="relative pl-8">
                                    <div className="absolute left-[13px] top-2 bottom-6 w-[1px] bg-[hsl(var(--border))]" />

                                    {getTimelineLog(selectedIssue).map((log, i) => (
                                        <div key={i} className="relative pb-8 last:pb-0">
                                            <div className={`absolute -left-8 top-0 w-7 h-7 rounded border flex items-center justify-center z-10 ${log.status === "completed"
                                                    ? "bg-[hsl(var(--foreground))] border-[hsl(var(--foreground))] text-[hsl(var(--background))]"
                                                    : log.status === "active"
                                                        ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white"
                                                        : "bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                                                }`}>
                                                {log.icon}
                                            </div>

                                            <div className="space-y-0.5">
                                                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{log.time}</span>
                                                <h4 className={`text-sm font-semibold leading-tight ${log.status === "pending" ? "text-[hsl(var(--muted-foreground))]" : "text-[hsl(var(--foreground))]"
                                                    }`}>
                                                    {log.stage}
                                                </h4>
                                                <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                                                    {log.event}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

