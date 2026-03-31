import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DashboardLayout from "../../layout/DashboardLayout";
import {
 CheckCircle2,
 Clock,
 Star,
 Share2,
 Download,
 Calendar,
 Filter,
 MapPin,
 Loader2,
 BarChart as BarChartIcon,
 TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 AreaChart,
 Area,
} from "recharts";

const deptColors = {
 "PUBLIC WORKS": "bg-primary text-primary-foreground",
 "UTILITIES": "bg-success text-success-foreground",
 "SANITATION": "bg-warning text-warning-foreground",
 "ROAD": "bg-destructive text-destructive-foreground",
 "GENERAL": "bg-muted text-muted-foreground",
};

const Analytics = () => {
 const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState({ totalResolved: "0", avgResolutionTime: "0d", impactScore: "0/1000" });
 const [resolvedItems, setResolvedItems] = useState([]);
 const [filterDept, setFilterDept] = useState("all");
 
 const token = localStorage.getItem("token");

 const exportReport = () => {
 if (resolvedItems.length === 0) return;
 const headers = ["ID", "Title", "Department", "Location", "Reported", "Resolved", "Duration"];
 const rows = resolvedItems.map(i => [i.id, i.title, i.department, i.location, i.reported, i.fixed, i.duration]);
 const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 const link = document.createElement("a");
 link.href = URL.createObjectURL(blob);
 link.download = `civic_impact_report_${new Date().toLocaleDateString()}.csv`;
 link.click();
 };

 useEffect(() => {
 const fetchAnalytics = async () => {
 try {
 setLoading(true);
 const res = await axios.get("http://127.0.0.1:5000/api/analytics/citizen", {
 headers: { Authorization: `Bearer ${token}` }
 });
 if (res.data) {
 setStats(res.data.stats);
 setResolvedItems(res.data.resolvedItems);
 }
 } catch (err) {
 console.error("Analytics Fetch Error:", err);
 } finally {
 setLoading(false);
 }
 };
 fetchAnalytics();
 }, [token]);

 // Chart Data Derivation
 const chartData = useMemo(() => {
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 const currentYear = new Date().getFullYear();
 
 // Grouping by month
 const grouped = resolvedItems.reduce((acc, item) => {
 const date = new Date(item.fixed);
 if (date.getFullYear() === currentYear) {
 const month = months[date.getMonth()];
 acc[month] = (acc[month] || 0) + 1;
 }
 return acc;
 }, {});

 return months.map(m => ({ name: m, resolved: grouped[m] || 0 }));
 }, [resolvedItems]);

 const engagementData = useMemo(() => {
 return resolvedItems.slice(0, 10).reverse().map(i => ({
 name: i.reported,
 upvotes: i.upvotes || 0
 }));
 }, [resolvedItems]);

 const filteredItems = resolvedItems.filter(item => 
 filterDept === "all" || item.department.toUpperCase() === filterDept.toUpperCase()
 );

 const departments = [...new Set(resolvedItems.map(i => i.department.toUpperCase()))];

 const summaryCards = [
 { icon: CheckCircle2, iconColor: "text-success bg-success/10", label: "Total Resolved", value: stats.totalResolved, trend: "↗" },
 { icon: Clock, iconColor: "text-primary bg-primary/10", label: "Avg Resolution Time", value: stats.avgResolutionTime, trend: "↘" },
 { icon: Star, iconColor: "text-warning bg-warning/10", label: "Impact Score", value: stats.impactScore, trend: "↗" },
 ];

 if (loading) {
 return (
 <DashboardLayout>
 <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
 <Loader2 className="w-10 h-10 animate-spin text-primary" />
 <p className="text-sm font-black tracking-[0.2em] opacity-60">Synchronizing Impact Archive...</p>
 </div>
 </DashboardLayout>
 );
 }

 return (
 <DashboardLayout>
 <div className="space-y-8 animate-in fade-in duration-700">
 
 {/* Header */}
 <div className="flex items-center justify-between flex-wrap gap-6 relative overflow-hidden p-8 rounded-[2.5rem] border border-border bg-card shadow-2xl transition-all">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
 <div className="relative z-10">
 <p className="text-[10px] font-black tracking-[0.2em] text-primary mb-2">Home &gt; Impact History</p>
 <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2 transition-colors">
 Civic Impact History
 </h1>
 <p className="text-sm font-medium text-muted-foreground transition-colors max-w-xl">
 Real-time audit of your community accountability and resolved urban issues.
 </p>
 </div>

 <div className="relative z-10 flex gap-4">
 <button className="flex items-center gap-2 bg-background border border-border px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all active:scale-95 shadow-sm">
 <Share2 size={16} />
 Share
 </button>
 <button 
 onClick={exportReport}
 className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-xl shadow-primary/20"
 >
 <Download size={16} />
 Export Report
 </button>
 </div>
 </div>

 {/* Global Stats Grid */}
 <div className="grid gap-6 md:grid-cols-3">
 {summaryCards.map((card) => (
 <div key={card.label} className="group rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl transition-all hover:border-primary/30 relative overflow-hidden">
 <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
 <div className="flex items-center gap-4 mb-6">
 <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${card.iconColor}`}>
 <card.icon size={24} className="font-black" />
 </div>
 <span className="text-[10px] font-black tracking-widest text-muted-foreground opacity-60">{card.label}</span>
 </div>
 <div className="flex items-baseline gap-3">
 <span className="text-4xl font-black text-foreground tracking-tighter transition-colors">{card.value}</span>
 <span className="text-xs font-black text-success tracking-widest">{card.trend}</span>
 </div>
 </div>
 ))}
 </div>

 {/* Dynamic Charts Grid */}
 <div className="grid gap-8 lg:grid-cols-2">
 {/* Resolution Velocity Chart */}
 <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl relative overflow-hidden transition-all">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-3">
 <BarChartIcon size={20} className="text-primary" />
 Resolution Velocity
 </h3>
 <p className="text-xs font-bold text-muted-foreground opacity-60 tracking-widest mt-1">Monthly Mission Completion</p>
 </div>
 </div>
 
 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={chartData}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
 <XAxis 
 dataKey="name" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} 
 />
 <YAxis 
 hide={true}
 />
 <Tooltip 
 contentStyle={{ 
 backgroundColor: "hsl(var(--card))", 
 border: "1px solid hsl(var(--border))",
 borderRadius: "1rem",
 boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
 }}
 labelStyle={{ fontWeight: 800, textTransform: " ", fontSize: 10, color: "hsl(var(--primary))" }}
 />
 <Bar 
 dataKey="resolved" 
 fill="hsl(var(--primary))" 
 radius={[8, 8, 8, 8]}
 barSize={30}
 />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* Community Engagement Area Chart */}
 <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl relative overflow-hidden transition-all">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-3">
 <TrendingUp size={20} className="text-success" />
 Engagement Trend
 </h3>
 <p className="text-xs font-bold text-muted-foreground opacity-60 tracking-widest mt-1">Community Upvotes Velocity</p>
 </div>
 </div>

 <div className="h-64 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart data={engagementData}>
 <defs>
 <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
 <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
 <XAxis 
 dataKey="name" 
 axisLine={false} 
 tickLine={false} 
 tick={{ fontSize: 10, fontWeight: 800, fill: "hsl(var(--muted-foreground))" }} 
 />
 <Tooltip 
 contentStyle={{ 
 backgroundColor: "hsl(var(--card))", 
 border: "1px solid hsl(var(--border))",
 borderRadius: "1rem"
 }}
 />
 <Area 
 type="monotone" 
 dataKey="upvotes" 
 stroke="hsl(var(--primary))" 
 fillOpacity={1} 
 fill="url(#colorUp)" 
 strokeWidth={4}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 </div>

 {/* Filters Wrapper */}
 <div className="flex gap-4 items-center flex-wrap p-2 bg-muted/20 border border-border rounded-[2rem]">
 <div className="flex items-center gap-2 bg-background border border-border px-6 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest text-muted-foreground shadow-sm">
 <Calendar size={14} className="text-primary" />
 Lifetime History
 </div>

 <select 
 value={filterDept}
 onChange={(e) => setFilterDept(e.target.value)}
 className="flex items-center gap-2 bg-background border border-border px-6 py-3 rounded-[1.5rem] text-[10px] font-black tracking-widest text-muted-foreground hover:border-primary transition-all shadow-sm outline-none cursor-pointer"
 >
 <option value="all">All Sectors</option>
 {departments.map(dept => (
 <option key={dept} value={dept}>{dept}</option>
 ))}
 </select>

 <span className="ml-auto px-6 text-[10px] font-black tracking-[0.2em] text-muted-foreground opacity-40">
 Showing {filteredItems.length} resolved records
 </span>
 </div>

 {/* Resolved Items */}
 <div className="space-y-6">
 {filteredItems.length === 0 ? (
 <div className="text-center py-20 border border-dashed border-border rounded-[2.5rem] bg-card/30">
 <CheckCircle2 size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
 <p className="text-xs font-black tracking-[0.2em] text-muted-foreground opacity-40">No records match your filter</p>
 </div>
 ) : (
 filteredItems.map((item) => (
 <div key={item.id} className="group rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl transition-colors hover:border-primary/20 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
 <div className="relative z-10 flex items-start justify-between flex-wrap gap-8">
 <div className="flex-1 space-y-6">
 <div className="flex items-center gap-3">
 <span className={`rounded-xl px-4 py-1.5 text-[10px] font-black tracking-widest shadow-sm ${deptColors[item.department.toUpperCase()] || deptColors.GENERAL}`}>
 {item.department}
 </span>
 <div className="h-1 w-1 rounded-full bg-border"></div>
 <span className="text-[10px] font-black tracking-widest text-success">Mission Resolved</span>
 </div>
 <h3 className="text-2xl font-black text-foreground tracking-tight transition-colors">{item.title}</h3>
 <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground opacity-80 transition-colors">
 <MapPin size={16} className="text-primary" />
 {item.location}
 </div>

 {/* Timeline */}
 <div className="pt-8 flex items-center gap-0 w-full overflow-x-auto custom-scrollbar">
 {["REPORTED", "FIXED", "VERIFIED"].map((step, i) => (
 <div key={step} className="flex items-center shrink-0">
 <div className="flex flex-col items-center gap-2">
 <div className="h-6 w-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 transform group-hover:scale-110 transition-transform">
 <CheckCircle2 size={14} className="font-black" />
 </div>
 <div className="text-center">
 <p className="text-[9px] font-black tracking-widest text-muted-foreground opacity-40 mb-0.5">{step}</p>
 <p className="text-[10px] font-black text-foreground tracking-tight transition-colors">
 {[item.reported, item.fixed, item.verified][i]}
 </p>
 </div>
 </div>
 {i < 2 && <div className="h-0.5 w-16 sm:w-24 bg-primary/20 mx-4 shadow-inner" />}
 </div>
 ))}
 </div>

 <div className="pt-6 border-t border-border flex items-center gap-8 text-[10px] font-black tracking-widest text-muted-foreground transition-colors">
 <div className="flex items-center gap-2">
 <span className="opacity-40">Support:</span>
 <span className="text-foreground transition-colors">{item.upvotes} Citizens</span>
 </div>
 <div className="flex items-center gap-2">
 <span className="opacity-40">Speed:</span>
 <span className="text-foreground transition-colors">{item.duration}</span>
 </div>
 </div>
 </div>
 <Link
 to={`/issue/${item.id}`}
 className="bg-background border border-border px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm mt-auto"
 >
 View History →
 </Link>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </DashboardLayout>
 );
};

export default Analytics;

