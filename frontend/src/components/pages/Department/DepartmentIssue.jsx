import { useState, useEffect } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
 Search,
 Eye,
 Pencil,
 Trash2,
 RefreshCcw,
 X,
 Clock,
 MapPin,
 AlertTriangle,
 ChevronRight,
 Filter,
 Users,
 Calendar,
 Zap,
 MoreHorizontal,
 ArrowRight,
 CheckCircle,
 FileText,
 Activity
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
 const configs = {
 "New": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
 "In Progress": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
 "Completed": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
 "Escalated": { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" },
 "default": { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
 };
 const config = configs[status] || configs.default;
 return (
 <span className={`${config.bg} ${config.text} ${config.border} border px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider`}>
 {status}
 </span>
 );
};

const PriorityBadge = ({ level }) => {
 const configs = {
 high: { icon: Zap, color: "text-red-500", label: "CRITICAL" },
 medium: { icon: AlertTriangle, color: "text-amber-500", label: "ELEVATED" },
 low: { icon: Clock, color: "text-blue-500", label: "STANDARD" }
 };
 const config = configs[level] || configs.low;
 const Icon = config.icon;
 return (
 <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/40 rounded-lg w-fit">
 <Icon size={12} className={config.color} />
 <span className={`text-[10px] font-black tracking-widest ${config.color}`}>{config.label}</span>
 </div>
 );
};

const Issues = () => {
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState("New");
 const [search, setSearch] = useState("");
 const [zone, setZone] = useState("");
 const [priority, setPriority] = useState("");
 const [selectedId, setSelectedId] = useState(null);
 const [task, setTask] = useState(null);
 const [issuesData, setIssuesData] = useState([]);
 const [zones, setZones] = useState([]);
 const [loading, setLoading] = useState(true);

 const [stats, setStats] = useState({
 total: 0,
 pending: 0,
 inProgress: 0,
 resolved: 0,
 });

 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const limit = 10;

 const fetchData = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem("token");
 if (!token) return;

 const [issuesRes, statsRes] = await Promise.all([
 axios.get(`http://localhost:5000/api/issues/department/issue?page=${page}&limit=${limit}&zone=${zone}&priority=${priority}`, {
 headers: { Authorization: `Bearer ${token}` }
 }),
 axios.get("http://localhost:5000/api/issues/department/stats", {
 headers: { Authorization: `Bearer ${token}` }
 })
 ]);

 const formatted = (issuesRes.data.issues || []).map((issue) => ({
 id: issue._id,
 title: issue.title,
 zone: issue.zone,
 priority: issue.priority?.level?.toLowerCase() || "low",
 assignment: issue.assignedTo?.fullName || "Unassigned",
 rawStatus: issue.status,
 status: ["reported", "assigned", "pending_verification"].includes(issue.status) ? "New" :
 ["resolved", "closed"].includes(issue.status) ? "Completed" :
 issue.status === "escalated" ? "Escalated" :
 "In Progress",
 deadline: issue.sla?.resolutionDeadline ? new Date(issue.sla.resolutionDeadline) : null,
 isBreach: issue.sla?.isBreached
 }));

 setIssuesData(formatted);
 if (issuesRes.data.zones) setZones(issuesRes.data.zones);
 setTotalPages(Math.ceil(issuesRes.data.total / limit) || 1);
 setStats(statsRes.data);
 } catch (err) {
 console.error("Dashboard Fetch Error:", err);
 toast.error("Real-time data sync failed");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 }, [page, zone, priority]);

 const fetchTask = async (id) => {
 try {
 const token = localStorage.getItem("token");
 const res = await axios.get(`http://127.0.0.1:5000/api/issues/${id}`, {
 headers: { Authorization: `Bearer ${token}` },
 });
 const issue = res.data;
 setTask({
 id: issue._id,
 title: issue.title,
 description: issue.description?.text || "No descriptive brief.",
 location: issue.fullAddress || "Geo-coordinates pending",
 status: ["reported", "assigned", "pending_verification"].includes(issue.status) ? "New" :
 ["resolved", "closed"].includes(issue.status) ? "Completed" :
 issue.status === "escalated" ? "Escalated" :
 "In Progress",
 priority: issue.priority?.level || "low",
 deadline: issue.sla?.resolutionDeadline ? new Date(issue.sla.resolutionDeadline).toLocaleString() : "N/A",
 operator: issue.assignedTo?.fullName || "Awaiting Operator",
 escalationLevel: issue.sla?.escalationLevel || 1,
 citizen: issue.reportedBy?.fullName || "Verified Citizen",
 escalation: issue.resolution?.escalation || null,
 rawStatus: issue.status
 });
 } catch (err) {
 console.error(err);
 toast.error("Failed to load task details");
 }
 };

 useEffect(() => {
 if (selectedId) fetchTask(selectedId);
 }, [selectedId]);

 const filteredIssues = issuesData
 .filter((issue) => activeTab === "All" || issue.status === activeTab)
 .filter((issue) => issue.title.toLowerCase().includes(search.toLowerCase()));

 return (
 <DepartmentLayout>
 <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

 {/* HEADER SECTION */}
 <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
 <div>
 <h1 className="text-3xl font-semibold text-foreground">
 Task Management
 </h1>
 <p className="text-sm text-muted-foreground mt-1">
 Mission oversight and territorial incident control
 </p>
 </div>

 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border">
 <div className="h-2 w-2 rounded-full bg-emerald-500" />
 <span className="text-xs font-bold text-muted-foreground tracking-widest">Protocol Active</span>
 </div>
 </div>
 </div>

 {/* STATS GRID */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <StatBox title="Deployment Load" value={stats.total} icon={FileText} color="text-blue-500" bg="bg-blue-500/10" />
 <StatBox title="Incoming Queue" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-500/10" />
 <StatBox title="Active Field" value={stats.inProgress} icon={Zap} color="text-purple-500" bg="bg-purple-500/10" />
 <StatBox title="Neutralized" value={stats.resolved} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
 </div>

 {/* CONTROLS BAR */}
 <div className="bg-card border rounded-2xl p-4 shadow-sm space-y-4 lg:space-y-0 lg:flex items-center justify-between gap-6">

 <div className="flex p-1 bg-muted rounded-xl gap-1">
 {["All", "New", "In Progress", "Escalated", "Completed"].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
 ? "bg-background text-primary shadow-sm"
 : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
 <div className="relative flex-1 group w-full">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Filter specific mission..."
 className="w-full bg-muted/40 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>

 <div className="flex gap-2 w-full md:w-auto">
 <select
 className="bg-muted/40 border border-border/50 text-[11px] font-bold px-4 py-3 rounded-xl outline-none hover:border-primary/30 transition-all flex-1 md:flex-none"
 value={zone}
 onChange={(e) => { setZone(e.target.value); setPage(1); }}
 >
 <option value="">All Sectors</option>
 {zones.map(z => <option key={z} value={z}>{z}</option>)}
 </select>

 <select
 className="bg-muted/40 border border-border/50 text-[11px] font-bold px-4 py-3 rounded-xl outline-none hover:border-primary/30 transition-all flex-1 md:flex-none"
 value={priority}
 onChange={(e) => { setPriority(e.target.value); setPage(1); }}
 >
 <option value="">All Prior</option>
 <option value="high">Critical</option>
 <option value="medium">Elevated</option>
 <option value="low">Standard</option>
 </select>
 </div>
 </div>
 </div>

 {/* REGISTRY TABLE */}
 <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="bg-muted/30 border-b">
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Mission ID</th>
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Name</th>
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Sector</th>
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Priority</th>
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Status</th>
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Deadline</th>
 <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider text-right">Actions</th>
 </tr>
 </thead>

 <tbody className="divide-y">
 {loading ? (
 Array(5).fill(0).map((_, i) => (
 <tr key={i} className="animate-pulse">
 <td colSpan={7} className="p-6 bg-muted/10 h-16" />
 </tr>
 ))
 ) : filteredIssues.map((issue) => (
 <tr key={issue.id} className="hover:bg-muted/5 transition-colors group">
 <td className="p-5">
 <span className="font-mono text-xs text-primary font-bold">#{(issue.id?.slice(-6))}</span>
 </td>
 <td className="p-5">
 <p className="font-semibold text-sm text-foreground">{issue.title}</p>
 <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
 <Users size={12} />
 <span className="text-[10px] font-medium tracking-tight">{issue.assignment}</span>
 </div>
 </td>
 <td className="p-5">
 <div className="flex items-center gap-2">
 <MapPin size={14} className="text-muted-foreground" />
 <span className="text-xs font-semibold">{issue.zone}</span>
 </div>
 </td>
 <td className="p-5">
 <PriorityBadge level={issue.priority} />
 </td>
 <td className="p-5">
 <StatusBadge status={issue.status} />
 </td>
 <td className="p-5">
 {issue.deadline ? (
 <div className={`flex items-center gap-2 ${issue.isBreach ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
 <Calendar size={13} />
 <span className="text-xs font-medium">{issue.deadline.toLocaleDateString()}</span>
 </div>
 ) : (
 <span className="text-muted-foreground/40 text-[10px] font-bold italic">Unspecified</span>
 )}
 </td>
 <td className="p-5 text-right">
 <button onClick={() => setSelectedId(issue.id)} className="p-2.5 hover:bg-primary/10 rounded-lg text-primary transition-all opacity-0 group-hover:opacity-100">
 <Eye size={18} />
 </button>
 <button className="p-2.5 hover:bg-muted rounded-lg text-muted-foreground transition-all opacity-0 group-hover:opacity-100">
 <MoreHorizontal size={18} />
 </button>
 </td>
 </tr>
 ))}
 {!loading && filteredIssues.length === 0 && (
 <tr>
 <td colSpan={7} className="p-20 text-center">
 <Activity size={32} className="mx-auto mb-4 text-muted-foreground/30" />
 <p className="text-sm font-medium text-muted-foreground tracking-widest italic opacity-50">Zero tactical missions detected</p>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* PAGINATION CONTROL */}
 <div className="flex justify-between items-center p-6 border-t bg-muted/20">
 <span className="text-xs font-medium text-muted-foreground">Displaying Layer {page} of Registry</span>
 <div className="flex gap-2">
 <button
 disabled={page === 1}
 onClick={() => setPage(page - 1)}
 className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed transition"
 >
 PREVIOUS
 </button>
 <button
 disabled={page === totalPages}
 onClick={() => setPage(page + 1)}
 className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-30 transition"
 >
 NEXT LAYER
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* MISSION ANALYSIS MODAL */}
 {selectedId && task && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
 <div className="bg-card w-full max-w-[900px] rounded-[2rem] overflow-hidden border shadow-2xl relative animate-in zoom-in-95 duration-300">

 <div className="p-8 border-b bg-muted/20 flex justify-between items-start">
 <div>
 <div className="flex items-center gap-3 mb-4">
 <StatusBadge status={task.status} />
 <PriorityBadge level={task.priority} />
 </div>
 <h2 className="text-3xl font-semibold tracking-tight leading-tight">{task.title}</h2>
 </div>
 <button
 onClick={() => { setSelectedId(null); setTask(null); }}
 className="p-2.5 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-foreground"
 >
 <X size={22} />
 </button>
 </div>

 <div className="p-10 space-y-10">
 {/* TOP SECTION: DETAILS */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
 <div className="space-y-6">
 <div className="space-y-2">
 <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Incident Intelligence</p>
 <div className="p-6 bg-muted/40 rounded-xl border border-border/50">
 <p className="text-sm leading-relaxed text-foreground font-medium">{task.description}</p>
 </div>
 </div>

 <div className="flex items-center gap-4 text-xs font-semibold">
 <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex-1">
 <Users size={14} className="text-blue-500" />
 <span>{task.operator}</span>
 </div>
 <div className="flex items-center gap-2 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex-1">
 <AlertTriangle size={14} className="text-amber-500" />
 <span>Level {task.escalationLevel}</span>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-2">
 <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Spatial Geometry</p>
 <div className="p-4 bg-muted/40 border rounded-xl flex items-center gap-4">
 <MapPin size={20} className="text-primary" />
 <div>
 <p className="text-[9px] font-black text-muted-foreground ">Precision Location</p>
 <p className="text-xs font-bold">{task.location}</p>
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Protocol Schedule</p>
 <div className="p-4 bg-muted/40 border rounded-xl flex items-center gap-4">
 <Clock size={20} className="text-red-500" />
 <div>
 <p className="text-[9px] font-black text-muted-foreground ">Final Deadline</p>
 <p className="text-xs font-bold">{task.deadline}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* REPORTER BLOCK */}
 <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
 <div className="flex items-center gap-4">
 <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
 {task.citizen[0]}
 </div>
 <div>
 <p className="text-[10px] font-black text-primary ">Reporter Profile</p>
 <p className="text-sm font-bold">{task.citizen}</p>
 </div>
 </div>
 <button className="px-5 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors">
 Secure Channel
 </button>
 </div>

 {/* ESCALATION BLOCK */}
 {task.escalation && (
 <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl space-y-5 animate-in slide-in-from-top-4">
 <div className="flex items-center gap-3 text-red-500 font-bold text-xs tracking-widest">
 <AlertTriangle size={18} /> ESCALATION DIRECTIVE & EVIDENCE
 </div>
 <p className="text-sm italic font-medium">"{task.escalation.reason}"</p>
 {task.escalation.proof && (
 <div className="rounded-xl overflow-hidden border shadow-lg bg-black/40">
 <img
 src={`http://localhost:5000${task.escalation.proof}`}
 alt="Escalation Proof"
 className="w-full h-auto max-h-[350px] object-contain mx-auto"
 />
 </div>
 )}
 </div>
 )}

 {/* ACTION BUTTONS */}
 <div className="flex gap-4 pt-6 border-t">
 {task.rawStatus === "escalated" ? (
 <>
 <button
 onClick={async () => {
 const token = localStorage.getItem("token");
 await axios.put(`http://localhost:5000/api/issues/${task.id}/status`,
 { status: "closed", remark: "Escalation approved by Admin." },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 toast.success("Task Neutralized");
 setSelectedId(null);
 fetchData();
 }}
 className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
 >
 <CheckCircle size={18} />
 Authorize & Close
 </button>
 <button
 onClick={async () => {
 const token = localStorage.getItem("token");
 await axios.put(`http://localhost:5000/api/issues/${task.id}/status`,
 { status: "in_progress", remark: "Escalation rejected. Insufficient data." },
 { headers: { Authorization: `Bearer ${token}` } }
 );
 toast.success("Escalation Rejected");
 setSelectedId(null);
 fetchData();
 }}
 className="flex-1 bg-muted border font-bold py-4 rounded-xl hover:bg-background transition-all active:scale-95"
 >
 Reject Escalation
 </button>
 </>
 ) : (
 <>
 <button className="flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
 Redirect Asset
 <ArrowRight size={18} />
 </button>
 <button className="flex-1 border font-bold py-4 rounded-xl hover:bg-muted transition-all">
 Audit Archive
 </button>
 </>
 )}
 </div>
 </div>
 </div>
 </div>
 )}
 </DepartmentLayout>
 );
};

const StatBox = ({ title, value, icon: Icon, color, bg }) => (
 <div className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition duration-300">
 <div className="flex items-center gap-4 mb-4">
 <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
 <Icon size={20} />
 </div>
 <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em]">{title}</p>
 </div>
 <h2 className="text-3xl font-bold leading-none">{value}</h2>
 </div>
);

export default Issues;

