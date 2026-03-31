import DashboardLayout from "../../layout/DashboardLayout";
import {
 Plus,
 Search,
 MapPin,
 Eye,
 Filter,
 ArrowRight,
 Clock,
 TrendingUp,
 Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Reports = () => {
 const [issues, setIssues] = useState([]);
 const [filtered, setFiltered] = useState([]);
 const [activeTab, setActiveTab] = useState(0);
 const [selected, setSelected] = useState(0);

 /* PAGINATION */
 const [page, setPage] = useState(1);
 const [total, setTotal] = useState(0);
 const limit = 6;

 const token = localStorage.getItem("token");

 /* ================= FETCH ================= */
 const fetchIssues = async (pageNumber = 1) => {
 try {
 const res = await axios.get(
 `http://127.0.0.1:5000/api/issues/my?page=${pageNumber}&limit=${limit}`,
 {
 headers: {
 Authorization: `Bearer ${token}`,
 },
 }
 );

 const data = res.data.issues || [];
 setIssues(data);
 setFiltered(data);
 setTotal(res.data.total);
 setPage(res.data.page);
 } catch (err) {
 toast.error("Failed to load issues");
 }
 };

 useEffect(() => {
 fetchIssues(page);
 }, [page]);

 /* ================= FILTER ================= */
 const handleTab = (index) => {
 setActiveTab(index);
 if (index === 0) return setFiltered(issues);
 
 const statusGroups = [
 [], // All
 ["reported", "assigned", "pending_verification"], // Pending
 ["in_progress", "reopened", "escalated"], // Active
 ["resolved", "closed"] // Closed
 ];
 setFiltered(issues.filter((i) => statusGroups[index].includes(i.status)));
 };

 /* ================= SEARCH ================= */
 const handleSearch = (e) => {
 const value = e.target.value.toLowerCase();
 setFiltered(issues.filter((i) =>
 i.title.toLowerCase().includes(value) ||
 (i.category?.label || "").toLowerCase().includes(value)
 ));
 };

 const getStatusColor = (status) => {
 const config = {
 reported: "border-blue-500/50 text-blue-500 bg-blue-500/10",
 assigned: "border-indigo-500/50 text-indigo-500 bg-indigo-500/10",
 in_progress: "border-amber-500/50 text-amber-500 bg-amber-500/10",
 pending_verification: "border-purple-500/50 text-purple-500 bg-purple-500/10",
 resolved: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10",
 closed: "border-gray-700/50 text-gray-400 bg-gray-800/20",
 reopened: "border-orange-500/50 text-orange-500 bg-orange-500/10",
 escalated: "border-red-500/50 text-red-500 bg-red-500/10"
 };
 return config[status] || "border-gray-500/50 text-gray-500 bg-gray-500/10";
 };

 const selectedIssue = filtered[selected] || null;
 const totalPages = Math.ceil(total / limit);

 return (
 <DashboardLayout>
 <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-180px)] animate-in fade-in duration-700">

 {/* LEFT SIDE: LISTING */}
 <div className="flex-1 space-y-8">

 {/* HEADER SECTION */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div>
 <h1 className="text-3xl font-black text-foreground tracking-tighter transition-colors">Your Registry</h1>
 <p className="text-sm text-muted-foreground font-medium font-mono tracking-widest mt-1 transition-colors">Incident Archive & Tracking</p>
 </div>
 <Link to="/report-issue">
 <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-black tracking-widest text-xs transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-2 group">
 Log New Incident <Plus size={16} className="group-hover:rotate-90 transition-transform" />
 </button>
 </Link>
 </div>

 {/* CONTROLS: TABS + SEARCH */}
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl transition-colors">
 {["All", "Pending", "Active", "Closed"].map((tab, i) => (
 <button
 key={i}
 onClick={() => handleTab(i)}
 className={`px-6 py-2 rounded-lg text-xs font-black tracking-widest transition-all ${i === activeTab ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
 }`}
 >
 {tab}
 </button>
 ))}
 </div>
 <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-muted-foreground transition-colors tracking-[0.2em]">
 <Filter size={14} /> Refine Stream
 </div>
 </div>

 <div className="relative group">
 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
 <input
 onChange={handleSearch}
 placeholder="Scan by title, category, or ID token..."
 className="w-full bg-card border border-border p-5 pl-14 rounded-[2rem] text-sm font-bold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-inner overflow-hidden"
 />
 </div>
 </div>

 {/* CARDS GRID */}
 <div className="grid md:grid-cols-2 gap-4">
 {filtered.length > 0 ? (
 filtered.map((issue, i) => (
 <button
 key={issue._id}
 onClick={() => setSelected(i)}
 className={`group relative overflow-hidden p-6 rounded-[2rem] border transition-all text-left transform active:scale-[0.98] ${selected === i ? "bg-primary/5 border-primary/50 shadow-2xl shadow-primary/5" : "bg-card border-border hover:border-primary/30"
 }`}
 >
 <div className="flex justify-between items-start mb-4">
 <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border transition-colors ${getStatusColor(issue.status)}`}>
 {issue.status?.replace('_', ' ')}
 </span>
 <span className="text-[10px] font-black text-muted-foreground font-mono transition-colors opacity-50">#{issue._id.slice(-6).toUpperCase()}</span>
 </div>

 <h3 className="text-lg font-black text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">
 {issue.title}
 </h3>
 <p className="text-xs font-bold text-muted-foreground tracking-widest mb-4 transition-colors opacity-70">
 {issue.category?.label || "General Infrastructure"}
 </p>

 <div className="flex items-center justify-between pt-4 border-t border-border/50 transition-colors">
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors">
 <MapPin size={12} className="text-success" />
 {issue.zone}
 </div>
 <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors">
 <Clock size={12} />
 {new Date(issue.createdAt).toLocaleDateString()}
 </div>
 </div>
 </button>
 ))
 ) : (
 <div className="col-span-full py-20 bg-card border border-border border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground transition-colors shadow-sm">
 <Zap className="h-12 w-12 mb-4 opacity-20" />
 <p className="text-xs font-black tracking-widest opacity-50">No matching records found</p>
 </div>
 )}
 </div>

 {/* PAGINATION UI */}
 <div className="flex items-center justify-between pt-8 border-t border-border">
 <button
 onClick={() => page > 1 && setPage(page - 1)}
 disabled={page === 1}
 className="px-6 py-2 bg-card border border-border text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all rounded-xl disabled:opacity-20 shadow-sm"
 >
 Prev Segment
 </button>
 <div className="flex items-center gap-2">
 {[...Array(totalPages)].map((_, i) => (
 <div key={i} className={`h-1.5 rounded-full transition-all ${page === i + 1 ? 'w-8 bg-primary shadow-glow' : 'w-2 bg-muted'}`}></div>
 ))}
 </div>
 <button
 onClick={() => page < totalPages && setPage(page + 1)}
 disabled={page === totalPages}
 className="px-6 py-2 bg-card border border-border text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all rounded-xl disabled:opacity-20 shadow-sm"
 >
 Next Segment
 </button>
 </div>

 </div>

 {/* RIGHT SIDE: INTELLIGENCE PANEL */}
 <div className="lg:w-[400px] shrink-0">
 <div className="sticky top-8 space-y-6">
 {selectedIssue ? (
 <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-700 transition-colors">
 <div className="p-8 border-b border-border bg-muted/20 flex items-center justify-between transition-colors">
 <h2 className="text-xs font-black text-foreground transition-colors tracking-[0.2em] flex items-center gap-2">
 <div className="h-2 w-2 rounded-full bg-primary shadow-glow"></div> Intelligence Panel
 </h2>
 <span className="text-[10px] font-black text-muted-foreground transition-colors opacity-50">v2.0.4</span>
 </div>

 <div className="p-10 space-y-8">
 <div>
 <h3 className="text-2xl font-black text-foreground transition-colors tracking-tighter mb-2">{selectedIssue.title}</h3>
 <div className="flex items-center gap-2">
 <span className="bg-background border border-border px-3 py-1 rounded-full text-[10px] font-black text-primary tracking-widest transition-colors shadow-sm">
 {selectedIssue.category?.label || "General"}
 </span>
 <span className="text-[10px] font-bold text-muted-foreground transition-colors tracking-widest opacity-50">Global Registry</span>
 </div>
 </div>

 <div className="bg-background border border-border rounded-3xl p-6 relative overflow-hidden group transition-colors shadow-sm">
 <div className="absolute top-2 right-2 opacity-5 text-primary"><TrendingUp size={60} /></div>
 <p className="text-[10px] font-black tracking-widest text-muted-foreground transition-colors mb-4 flex items-center gap-2">
 <Eye size={12} className="text-primary" /> Observation Brief
 </p>
 <p className="text-sm text-muted-foreground transition-colors font-medium leading-relaxed italic opacity-80">
 "{selectedIssue.description?.text?.slice(0, 150)}{selectedIssue.description?.text?.length > 150 ? '...' : ''}"
 </p>
 </div>

 <div className="space-y-4">
 <p className="text-[10px] font-black tracking-widest text-muted-foreground transition-colors opacity-50">Trace Timeline</p>
 <div className="relative pl-6 space-y-6 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-px before:bg-border transition-colors">
 <div className="relative">
 <div className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-primary shadow-glow ring-4 ring-primary/10"></div>
 <p className="text-[10px] font-black text-foreground transition-colors tracking-tight">Incident Registered</p>
 <p className="text-[10px] font-bold text-muted-foreground transition-colors mt-0.5 opacity-60">{new Date(selectedIssue.createdAt).toLocaleString()}</p>
 </div>
 <div className="relative">
 <div className={`absolute -left-6 top-1.5 w-2 h-2 rounded-full ring-4 transition-colors ${selectedIssue.status !== 'reported' ? 'bg-amber-600 ring-amber-600/10' : 'bg-muted ring-transparent'}`}></div>
 <p className={`text-[10px] font-black tracking-tight transition-colors ${selectedIssue.status !== 'reported' ? 'text-foreground' : 'text-muted-foreground opacity-30'}`}>Unit Dispatched</p>
 </div>
 <div className="relative">
 <div className={`absolute -left-6 top-1.5 w-2 h-2 rounded-full ring-4 transition-colors ${selectedIssue.status === 'resolved' ? 'bg-success ring-success/10' : 'bg-muted ring-transparent'}`}></div>
 <p className={`text-[10px] font-black tracking-tight transition-colors ${selectedIssue.status === 'resolved' ? 'text-foreground' : 'text-muted-foreground opacity-30'}`}>Mission Finalized</p>
 </div>
 </div>
 </div>

 <Link to={`/issue/${selectedIssue._id}`} className="block">
 <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-2xl font-black tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center gap-2">
 Inspect Detailed Logs <ArrowRight size={14} />
 </button>
 </Link>
 </div>
 </div>
 ) : (
 <div className="rounded-[2.5rem] border border-border border-dashed p-20 flex flex-col items-center justify-center text-center bg-card transition-colors shadow-sm">
 <div className="h-16 w-16 rounded-full bg-muted border border-border flex items-center justify-center mb-6 transition-colors font-mono">
 <Eye className="text-muted-foreground opacity-50 font-black" />
 </div>
 <h3 className="text-sm font-black text-foreground transition-colors tracking-widest mb-2">Select Record</h3>
 <p className="text-xs text-muted-foreground transition-colors font-medium opacity-60">Click on an incident report to retrieve strategic intelligence.</p>
 </div>
 )}

 <div className="rounded-[2rem] border border-border bg-card p-8 flex items-center justify-between transition-colors shadow-sm overflow-hidden relative">
 <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
 <div>
 <p className="text-[10px] font-black text-muted-foreground transition-colors tracking-widest opacity-50">Total Reports</p>
 <p className="text-2xl font-black text-foreground transition-colors tracking-tighter">{total}</p>
 </div>
 <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-all shadow-sm">
 <TrendingUp size={24} />
 </div>
 </div>
 </div>
 </div>

 </div>
 </DashboardLayout>
 );
};

export default Reports;

