import React, { useState, useEffect } from "react";
import axios from "axios";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer,
 BarChart,
 Bar,
 CartesianGrid
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Loader2, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Award, Activity } from "lucide-react";
import toast from "react-hot-toast";

const DepartmentPerformance = () => {
 const [data, setData] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchData = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem("token");
 const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/detailed-reports`, {
 headers: { Authorization: `Bearer ${token}` }
 });
 setData(res.data);
 } catch (err) {
 console.error("Fetch Performance Error:", err);
 toast.error("Failed to load performance metrics");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 }, []);

 if (loading) {
 return (
 <DepartmentLayout>
 <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
 <Loader2 className="animate-spin text-primary h-10 w-10" />
 <p className="text-sm text-muted-foreground animate-pulse">Analyzing Performance Data...</p>
 </div>
 </DepartmentLayout>
 );
 }

 const { summary, monthlyStats, categoryAnalysis } = data;

 return (
 <DepartmentLayout>
 <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

 {/* HEADER */}
 <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
 <div>
 <h1 className="text-3xl font-semibold text-foreground">
 Performance Analytics
 </h1>
 <p className="text-sm text-muted-foreground mt-1">
 Deep-dive metrics into departmental efficiency and SLAs
 </p>
 </div>

 <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-lg border">
 <Activity size={16} className="text-primary" />
 <span className="text-xs font-bold text-muted-foreground tracking-widest tracking-widest">Live Audit Active</span>
 </div>
 </div>

 {/* KPI CARDS */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {[
 { label: "Avg Resolution", value: `${summary.avgResolutionTime} hrs`, sub: "Target: 2.5 hrs", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
 { label: "SLA Compliance", value: `${summary.slaCompliance}%`, sub: "Target: 95%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
 { label: "Total Resolved", value: summary.totalResolved, sub: `In ${summary.totalIssues} cases`, icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
 { label: "Performance Grade", value: "A+", sub: "Top 10% Municipality", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" }
 ].map((kpi, i) => (
 <div key={i} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition group">
 <div className="flex justify-between items-start mb-4">
 <div className={`p-2.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
 <kpi.icon size={20} />
 </div>
 <span className="text-[10px] font-bold text-muted-foreground ">Live</span>
 </div>
 <h3 className="text-2xl font-bold">{kpi.value}</h3>
 <p className="text-xs font-semibold text-muted-foreground tracking-wider mt-1">{kpi.label}</p>
 <div className="mt-4 pt-3 border-t">
 <p className="text-[10px] font-medium text-muted-foreground">{kpi.sub}</p>
 </div>
 </div>
 ))}
 </div>

 {/* CHARTS SECTION */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

 {/* RESOLUTION TRENDS */}
 <div className="lg:col-span-2 bg-card border rounded-2xl p-8 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-lg font-semibold">Resolution Trajectory</h3>
 <p className="text-xs text-muted-foreground">Monthly neutralizing efficiency</p>
 </div>
 <TrendingUp size={20} className="text-muted-foreground opacity-30" />
 </div>

 <div className="h-[350px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={monthlyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
 <XAxis
 dataKey="month"
 stroke="hsl(var(--muted-foreground))"
 fontSize={11}
 fontWeight="500"
 axisLine={false}
 tickLine={false}
 tick={{ dy: 10 }}
 />
 <YAxis
 stroke="hsl(var(--muted-foreground))"
 fontSize={11}
 fontWeight="500"
 axisLine={false}
 tickLine={false}
 />
 <Tooltip
 contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }}
 cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
 />
 <Line
 type="monotone"
 dataKey="count"
 stroke="hsl(var(--primary))"
 strokeWidth={3}
 dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2 }}
 activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
 />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>

 {/* SLA UTILIZATION */}
 <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col items-center">
 <div className="w-full text-left mb-10">
 <h3 className="text-lg font-semibold text-center">Service Reliability</h3>
 <p className="text-xs text-muted-foreground text-center mt-1">SLA Compliance Target vs Actual</p>
 </div>

 <div className="w-48 h-48 py-4">
 <CircularProgressbar
 value={parseFloat(summary.slaCompliance)}
 text={`${summary.slaCompliance}%`}
 strokeWidth={8}
 styles={buildStyles({
 pathColor: "hsl(var(--primary))",
 textColor: "hsl(var(--foreground))",
 trailColor: "hsl(var(--muted))",
 textSize: "18px",
 })}
 />
 </div>

 <div className="mt-10 p-4 bg-muted/30 rounded-xl border w-full text-center">
 <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-1">Audit Outcome</p>
 <p className="text-sm font-semibold text-emerald-500">OPTIMAL PERFORMANCE</p>
 </div>
 </div>

 </div>

 {/* CATEGORY VELOCITY */}
 <div className="bg-card border rounded-2xl p-8 shadow-sm">
 <div className="flex items-center justify-between mb-10">
 <div>
 <h3 className="text-lg font-semibold">Category Wise Details</h3>
 <p className="text-xs text-muted-foreground">Average hours until resolution per specialized sector</p>
 </div>
 <Activity size={20} className="text-muted-foreground opacity-30" />
 </div>

 <div className="h-[350px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={categoryAnalysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
 <XAxis
 dataKey="name"
 stroke="hsl(var(--muted-foreground))"
 fontSize={11}
 fontWeight="500"
 axisLine={false}
 tickLine={false}
 tick={{ dy: 10 }}
 />
 <YAxis
 stroke="hsl(var(--muted-foreground))"
 fontSize={11}
 fontWeight="500"
 axisLine={false}
 tickLine={false}
 />
 <Tooltip
 contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }}
 cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
 />
 <Bar
 dataKey="hours"
 fill="hsl(var(--primary))"
 radius={[6, 6, 0, 0]}
 barSize={32}
 />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 </div>
 </DepartmentLayout>
 );
};

export default DepartmentPerformance;


