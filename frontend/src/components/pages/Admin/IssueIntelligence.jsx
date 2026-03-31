
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, X, MapPin } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const severityColors = {
 CRITICAL: "bg-red-500/20 text-red-400",
 HIGH: "bg-orange-500/20 text-orange-400",
 MEDIUM: "bg-yellow-500/20 text-yellow-400",
 LOW: "bg-green-500/20 text-green-400",
};

export default function IssueIntelligence() {

 const [issues, setIssues] = useState([]);
 const [selectedIssue, setSelectedIssue] = useState(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [total, setTotal] = useState(0);
 const [loading, setLoading] = useState(false);
 const [activeTab, setActiveTab] = useState("all");
 /* 🔥 NEW STATE FOR STATS */
 const [stats, setStats] = useState({
 critical: 0,
 high: 0,
 medium: 0,
 low: 0,
 pending: 0,
 resolved: 0,
 });

 /*active table */
 const tabs = [
 { label: "All Issues", key: "all", count: total },
 { label: "Pending", key: "pending", count: stats.pending },
 { label: "Critical", key: "critical", count: stats.critical },
 { label: "Resolved", key: "resolved", count: stats.resolved },
];

const filteredIssues = issues.filter((issue) => {

 if (activeTab === "critical")
 return issue.priority?.level === "critical";

 if (activeTab === "pending")
 return issue.status === "reported";

 if (activeTab === "resolved")
 return issue.status === "resolved";

 return true;
});
 const token = localStorage.getItem("token");
 /* ================= CALCULATE STATS ================= */
 const calculateStats = (issues) => {
 let stats = {
 critical: 0,
 high: 0,
 medium: 0,
 low: 0,
 pending: 0,
 resolved: 0,
 };

 issues.forEach((issue) => {
 const level = issue.priority?.level;

 if (level === "critical") stats.critical++;
 else if (level === "high") stats.high++;
 else if (level === "medium") stats.medium++;
 else stats.low++;

 if (issue.status === "reported") stats.pending++;
 if (issue.status === "resolved") stats.resolved++;
 });

 setStats(stats);
 };

 /* ================= FETCH ================= */
 const fetchIssues = async () => {
 try {
 setLoading(true);

 const res = await fetch(
 `http://127.0.0.1:5000/api/issues/admin/all?search=${searchQuery}`,
 {
 headers: {
 Authorization: `Bearer ${token}`
 }
 }
 );

 const data = await res.json();

 if (data.success) {
 setIssues(data.issues || []);
 setTotal(data.total || 0);

 calculateStats(data.issues || []);

 if (data.issues?.length > 0) {
 setSelectedIssue(data.issues[0]);
 } else {
 setSelectedIssue(null);
 }
 }

 } catch {
 toast.error("Failed to load issues");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchIssues();
 }, []);

 /* ================= SEARCH ================= */
 useEffect(() => {
 const delay = setTimeout(() => {
 fetchIssues();
 }, 400);

 return () => clearTimeout(delay);
 }, [searchQuery]);

 return (
 <AdminLayout>
 <div className="space-y-4 text-foreground transition-colors duration-300">

 {/* HEADER */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <h1 className="text-2xl font-bold text-foreground">Issue Management</h1>

 <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-bold">
 {total} Total Cases
 </span>

 <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-md font-bold">
 Live Data
 </span>
 </div>

 <button
 onClick={() => toast("Opening report form...")}
 className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm"
 >
 <Plus className="w-4 h-4" />
 Manual Report
 </button>
 </div>

 {/* 🔥 STATS ROW (ADDED ONLY THIS) */}
 <div className="flex gap-3 flex-wrap">

 <span className="text-xs font-bold bg-destructive/20 text-destructive px-2 py-1 rounded-md border border-destructive/10">
 {stats.critical} Critical
 </span>

 <span className="text-xs font-bold bg-orange-600/20 text-orange-400 px-2 py-1 rounded-md border border-orange-500/10">
 {stats.high} High
 </span>

 <span className="text-xs font-bold bg-warning/20 text-warning-foreground px-2 py-1 rounded-md border border-warning/10">
 {stats.medium} Medium
 </span>

 <span className="text-xs font-bold bg-success/20 text-success px-2 py-1 rounded-md border border-success/10">
 {stats.low} Low
 </span>

 <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded-md border border-primary/10">
 {stats.pending} Pending
 </span>

 <span className="text-xs font-bold bg-purple-600/20 text-purple-400 px-2 py-1 rounded-md border border-purple-500/10">
 {stats.resolved} Resolved
 </span>

 </div>

 {/* 🔥 TABS */}
<div className="flex items-center gap-6 border-b border-border transition-colors">

 {tabs.map((tab) => (
 <button
 key={tab.key}
 onClick={() => setActiveTab(tab.key)}
 className={`pb-3 text-sm flex items-center gap-2 border-b-2 transition-all ${
 activeTab === tab.key
 ? "border-primary text-primary"
 : "border-transparent text-muted-foreground hover:text-foreground"
 }`}
 >
 {tab.label}

 <span
 className={`text-xs px-1.5 py-0.5 rounded font-bold transition-colors ${
 activeTab === tab.key
 ? "bg-primary/20 text-primary"
 : "bg-muted text-muted-foreground"
 }`}
 >
 {tab.count}
 </span>
 </button>
 ))}

</div>
 {/* SEARCH */}
 <div className="flex items-center gap-3">
 <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 transition-colors">
 <Search className="w-4 h-4 text-muted-foreground" />
 <input
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search issues..."
 className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground/50 font-medium"
 />
 </div>
 </div>

 {/* TABLE + DETAIL */}
 <div className="flex gap-4">

 {/* TABLE */}
 <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden transition-colors shadow-sm">

 {loading ? (
 <p className="p-6 text-muted-foreground italic">Loading issues...</p>
 ) : issues.length === 0 ? (
 <p className="p-6 text-muted-foreground italic text-center">No issues found</p>
 ) : (
 <table className="w-full text-sm">

 <thead>
 <tr className="border-b border-border text-xs text-muted-foreground bg-muted/30 transition-colors font-bold">
 <th className="text-left p-4">ISSUE</th>
 <th className="text-left p-4">LOCATION</th>
 <th className="text-left p-4">DEPARTMENT</th>
 <th className="text-left p-4">SEVERITY</th>
 </tr>
 </thead>

 <tbody>
 {filteredIssues.map((issue) => (
 <tr
 key={issue._id}
 onClick={() => setSelectedIssue(issue)}
 className={`cursor-pointer transition-colors ${
 selectedIssue?._id === issue._id
 ? "bg-muted"
 : "hover:bg-muted/50"
 }`}
 >
 <td className="p-4">
 <p className="font-semibold text-foreground">{issue.title}</p>
 <p className="text-xs text-muted-foreground">
 {issue.category}
 </p>
 </td>

 <td className="p-4 text-sm text-foreground opacity-80">
 {issue.zone || "N/A"}
 </td>

 <td className="p-4 text-primary font-medium">
 {issue.assignedDepartment?.departmentName || "Unassigned"}
 </td>

 <td className="p-4">
 <span
 className={`text-[10px] px-2 py-1 rounded font-black border border-current transition-colors ${
 severityColors[
 issue.priority?.level?.toUpperCase()
 ] || "bg-muted text-muted-foreground"
 }`}
 >
 {issue.priority?.level?.toUpperCase() || "LOW"}
 </span>
 </td>
 </tr>
 ))}
 </tbody>

 </table>
 )}
 </div>

 {/* DETAIL PANEL */}
 <div className="w-80 bg-card border border-border rounded-xl p-5 shadow-sm transition-colors overflow-hidden">

 {!selectedIssue ? (
 <p className="text-muted-foreground italic text-center py-10">Select an issue to view details</p>
 ) : (
 <div className="space-y-4">

 <div className="flex justify-between items-center mb-2">
 <span className="text-[10px] font-mono text-muted-foreground opacity-50 font-black">
 #{selectedIssue._id.slice(-6)}
 </span>

 <button
 onClick={() => setSelectedIssue(null)}
 className="text-muted-foreground hover:text-foreground transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 <h3 className="font-bold text-lg text-foreground leading-tight">
 {selectedIssue.title}
 </h3>

 <div className="bg-muted h-32 flex items-center justify-center text-muted-foreground rounded-lg border border-border/50 font-bold italic">
 📸 Image
 </div>

 <p className="text-sm text-muted-foreground leading-relaxed">
 {selectedIssue.description?.text}
 </p>

 <div className="text-sm text-primary font-semibold flex items-center gap-1.5">
 <MapPin className="w-4 h-4" />
 {selectedIssue.zone}
 </div>

 <div className="text-sm text-foreground/80 font-medium">
 <span className="text-muted-foreground mr-1">Department:</span>
 {selectedIssue.assignedDepartment?.departmentName || "Unassigned"}
 </div>

 </div>
 )}
 </div>

 </div>

 </div>
 </AdminLayout>
 );
}

