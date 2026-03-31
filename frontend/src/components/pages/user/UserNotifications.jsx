import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "axios";
import toast from "react-hot-toast";
import {
 Bell,
 CheckCircle2,
 RefreshCcw,
 ShieldCheck,
 AlertTriangle,
 Info,
 Check,
 CheckCheck,
 Clock,
 ChevronRight,
 Zap
} from "lucide-react";

const typeConfig = {
 verification_required: {
 icon: <ShieldCheck size={20} />,
 color: "text-purple-500",
 bg: "bg-purple-500/10",
 border: "border-purple-500/30",
 dot: "bg-purple-500",
 label: "Verification Required",
 },
 issue_resolved: {
 icon: <CheckCircle2 size={20} />,
 color: "text-emerald-500",
 bg: "bg-emerald-500/10",
 border: "border-emerald-500/30",
 dot: "bg-emerald-500",
 label: "Mission Resolved",
 },
 issue_reopened: {
 icon: <RefreshCcw size={20} />,
 color: "text-red-500",
 bg: "bg-red-500/10",
 border: "border-red-500/30",
 dot: "bg-red-500",
 label: "Disputed / Reopened",
 },
 issue_created: {
 icon: <Info size={20} />,
 color: "text-blue-500",
 bg: "bg-blue-500/10",
 border: "border-blue-500/30",
 dot: "bg-blue-500",
 label: "Registry Logged",
 },
};

const getConfig = (type) =>
 typeConfig[type] || {
 icon: <Bell size={20} />,
 color: "text-gray-400",
 bg: "bg-gray-500/10",
 border: "border-gray-500/30",
 dot: "bg-gray-500",
 label: type,
 };

const UserNotifications = () => {
 const [notifications, setNotifications] = useState([]);
 const [loading, setLoading] = useState(true);
 const [filter, setFilter] = useState("All");
 const token = localStorage.getItem("token");

 const fetchNotifications = async () => {
 try {
 const res = await axios.get(
 "http://127.0.0.1:5000/api/notification/user",
 { headers: { Authorization: `Bearer ${token}` } }
 );
 setNotifications(res.data);
 } catch (err) {
 toast.error("Failed to load metropolitan intelligence");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchNotifications();
 }, []);

 const markRead = async (id) => {
 try {
 await axios.put(
 `http://127.0.0.1:5000/api/notification/user/read/${id}`,
 {},
 { headers: { Authorization: `Bearer ${token}` } }
 );
 setNotifications((prev) =>
 prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
 );
 } catch {
 toast.error("Failed to update status");
 }
 };

 const markAllRead = async () => {
 try {
 await axios.put(
 "http://127.0.0.1:5000/api/notification/user/read-all",
 {},
 { headers: { Authorization: `Bearer ${token}` } }
 );
 setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
 toast.success("All broadcasts synchronized to read status");
 } catch {
 toast.error("Failed to synchronize broadcasts");
 }
 };

 const unreadCount = notifications.filter((n) => !n.isRead).length;

 const filtered =
 filter === "Unread"
 ? notifications.filter((n) => !n.isRead)
 : filter === "Read"
 ? notifications.filter((n) => n.isRead)
 : notifications;

 return (
 <DashboardLayout>
 <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
 
 {/* Header Strategic Block */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="space-y-1">
 <h1 className="text-3xl font-black text-foreground tracking-tighter flex items-center gap-3 transition-colors">
 <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary shadow-sm transition-colors">
 <Bell size={28} />
 </div>
 Command Intelligence
 </h1>
 <p className="text-muted-foreground font-medium text-sm transition-colors">
 {unreadCount > 0
 ? `System monitoring: ${unreadCount} active transmission${unreadCount > 1 ? "s" : ""} pending.`
 : "Metropolitan network clear. No pending alerts."}
 </p>
 </div>
 
 {unreadCount > 0 && (
 <button
 onClick={markAllRead}
 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary hover:text-primary-foreground bg-primary/5 hover:bg-primary border border-primary/20 px-6 py-3 rounded-2xl transition-all shadow-xl shadow-primary/5 active:scale-95"
 >
 <CheckCheck size={14} />
 Sync Read Status
 </button>
 )}
 </div>

 <div className="flex gap-2 p-1 bg-card border border-border rounded-[1.25rem] w-fit transition-colors">
 {["All", "Unread", "Read"].map((tab) => (
 <button
 key={tab}
 onClick={() => setFilter(tab)}
 className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
 filter === tab
 ? "bg-background border border-border text-foreground shadow-xl shadow-background/20"
 : "text-muted-foreground hover:text-foreground"
 }`}
 >
 {tab}
 {tab === "Unread" && unreadCount > 0 && (
 <span className="ml-3 bg-destructive text-destructive-foreground text-[8px] px-2 py-0.5 rounded-full ring-2 ring-destructive/20 transition-colors">
 {unreadCount}
 </span>
 )}
 </button>
 ))}
 </div>

 {/* Intelligence Stream */}
 {loading ? (
 <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/50 space-y-4 transition-colors">
 <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
 <p className="text-[10px] font-black tracking-widest animate-pulse font-display">Synchronizing Broadcasts...</p>
 </div>
 ) : filtered.length === 0 ? (
 <div className="bg-card border border-border rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden relative group transition-colors">
 <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
 <div className="h-20 w-20 rounded-3xl bg-background border border-border flex items-center justify-center text-muted-foreground/30 mb-6 group-hover:scale-110 group-hover:text-primary/30 transition-all duration-700 shadow-sm font-black italic">
 <Bell size={40} />
 </div>
 <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2 transition-colors">Null Sector</h3>
 <p className="text-muted-foreground font-medium max-w-xs leading-relaxed transition-colors opacity-60">
 No metropolitan broadcasts match the current matrix filter. High-frequency monitoring active.
 </p>
 </div>
 ) : (
 <div className="space-y-4">
 {filtered.map((n) => {
 const cfg = getConfig(n.type);
 return (
 <div
 key={n._id}
 className={`group relative overflow-hidden rounded-[2.25rem] border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl shadow-sm ${
 !n.isRead 
 ? "bg-card border-primary/30 shadow-primary/5" 
 : "bg-card/50 border-border hover:border-primary/20"
 }`}
 >
 {!n.isRead && (
 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 animate-pulse transition-all"></div>
 )}

 <div className="p-8 flex items-start gap-6">
 {/* Visual Pulse Indicator */}
 <div className="flex-shrink-0 mt-2">
 <div
 className={`w-3 h-3 rounded-full relative transition-colors ${
 !n.isRead ? cfg.dot : "bg-muted"
 }`}
 >
 {!n.isRead && <div className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-30`}></div>}
 </div>
 </div>

 {/* Operational Icon */}
 <div
 className={`flex-shrink-0 w-16 h-16 rounded-[1.5rem] border flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${cfg.bg} ${cfg.border} ${cfg.color}`}
 >
 {cfg.icon}
 </div>

 {/* Report Content */}
 <div className="flex-1 min-w-0">
 <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <span
 className={`text-[9px] px-3 py-0.5 rounded-full border font-black tracking-widest ${cfg.color} ${cfg.bg} ${cfg.border}`}
 >
 {cfg.label}
 </span>
 <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground transition-colors tracking-widest leading-none opacity-60">
 <Clock size={12} className="text-muted-foreground" />
 {new Date(n.createdAt).toLocaleDateString()}
 <span className="opacity-30">|</span>
 {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </div>
 </div>
 <h3 className={`text-xl font-black text-foreground tracking-tight transition-colors leading-tight group-hover:text-primary ${!n.isRead ? "opacity-100" : "opacity-70"}`}>
 {n.title}
 </h3>
 </div>
 </div>

 <p className="text-muted-foreground font-medium transition-colors leading-relaxed text-sm mb-6 max-w-2xl opacity-80">
 {n.message}
 </p>

 <div className="flex flex-wrap items-center gap-4">
 {n.issueId && (
 <Link
 to={`/issue/${n.issueId}`}
 className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-primary hover:text-primary-foreground transition-all bg-primary/5 hover:bg-primary px-5 py-2.5 rounded-xl border border-primary/20 shadow-sm"
 >
 Inspect Data <Zap size={10} className="text-amber-500 fill-amber-500" />
 </Link>
 )}
 
 {!n.isRead && (
 <button
 onClick={() => markRead(n._id)}
 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground transition-all px-4 py-2.5 rounded-xl border border-transparent hover:border-border active:scale-95 transition-colors"
 >
 <CheckCheck size={14} className="text-success" /> Acknowledge
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </DashboardLayout>
 );
};

export default UserNotifications;

