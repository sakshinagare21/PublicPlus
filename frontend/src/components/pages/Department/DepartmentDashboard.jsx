import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
 Zap,
 TrendingUp,
 Loader2,
 Calendar,
 Activity,
 ArrowRight,
 Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const DepartmentDashboard = () => {
 const [data, setData] = useState(null);
 const [loading, setLoading] = useState(true);

 const fetchData = async () => {
 try {
 setLoading(true);
 const token = localStorage.getItem("token");
 const res = await axios.get("http://localhost:5000/api/departments/detailed-reports", {
 headers: { Authorization: `Bearer ${token}` }
 });
 setData(res.data);
 } catch (err) {
 console.error("Dashboard Fetch Error:", err);
 toast.error("Failed to load dashboard data");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 }, []);

 const formatTimeGap = (date) => {
 const seconds = Math.floor((new Date() - new Date(date)) / 1000);
 if (seconds < 60) return `${seconds}s ago`;
 const minutes = Math.floor(seconds / 60);
 if (minutes < 60) return `${minutes} min ago`;
 const hours = Math.floor(minutes / 60);
 if (hours < 24) return `${hours} hr ago`;
 return `${Math.floor(hours / 24)} day ago`;
 };

 if (loading) {
 return (
 <DepartmentLayout>
 <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
 <Loader2 className="animate-spin text-primary h-10 w-10" />
 <p className="text-sm text-muted-foreground animate-pulse">Syncing tactical data...</p>
 </div>
 </DepartmentLayout>
 );
 }

  if (!data) {
    return (
      <DepartmentLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
          <div className="max-w-md w-full bg-card border border-destructive/20 rounded-[2.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive/50" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-destructive/5 rounded-full blur-3xl group-hover:bg-destructive/10 transition-colors" />
            
            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
              <AlertTriangle className="h-10 w-10 text-destructive animate-pulse" />
            </div>

            <h2 className="text-2xl font-black italic tracking-tighter mb-4">Tactical Link Failure</h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-10 italic">
              Your oversight authorization has expired or is invalid for this sector. Operational data cannot be synchronized until your credentials are refreshed.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black tracking-tighter hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                RE-SYNC STREAM
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/department-login";
                }}
                className="w-full py-4 border border-border rounded-2xl font-bold text-xs tracking-widest text-muted-foreground hover:bg-muted/50 transition-all uppercase"
              >
                Clear Session & Login
              </button>
            </div>
          </div>
        </div>
      </DepartmentLayout>
    );
  }

  const kpis = [
    {
      title: "Today's Issues",
      value: data.summary?.today || 0,
      label: "New issues reported today",
      icon: <Zap size={18} className="text-emerald-500" />,
      delay: "delay-100"
    },
    {
      title: "Weekly Activity",
      value: data.summary?.week || 0,
      label: "Issues this week",
      icon: <Activity size={18} className="text-blue-500" />,
      delay: "delay-200"
    },
    {
      title: "SLA Compliance",
      value: `${data.summary?.slaCompliance || 0}%`,
      label: "Resolved within time",
      icon: <TrendingUp size={18} className="text-primary" />,
      delay: "delay-300"
    },
    {
      title: "Total Issues",
      value: data.summary?.totalIssues || 0,
      label: "All-time records",
      icon: <Calendar size={18} className="text-amber-500" />,
      delay: "delay-400"
    }
  ];

 return (
 <DepartmentLayout>
 <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

 {/* HEADER */}
 <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
 <div className="animate-in fade-in slide-in-from-left-4 duration-500">
 <h1 className="text-4xl font-bold tracking-tight text-foreground italic">
 Department <span className="text-primary">Oversight</span>
 </h1>
 <p className="text-sm text-muted-foreground font-medium tracking-widest mt-1">
 Operational Efficacy & Activity Stream
 </p>
 </div>

 <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl border animate-in fade-in slide-in-from-right-4 duration-500">
 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
 <span className="text-xs font-bold text-muted-foreground tracking-widest">Active Link Established</span>
 </div>
 </div>

 {/* KPI GRID */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {kpis.map((kpi, i) => (
 <div
 key={i}
 className={`bg-card border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95 ${kpi.delay}`}
 >
 <div className="flex justify-between items-center mb-4">
 <div className="p-2 bg-muted/50 rounded-lg">
 {kpi.icon}
 </div>
 <span className="text-[10px] font-black text-muted-foreground tracking-widest opacity-30">LIVE</span>
 </div>

 <h3 className="text-3xl font-black italic tracking-tighter">{kpi.value}</h3>
 <p className="text-xs font-bold text-muted-foreground tracking-wider mt-1">{kpi.title}</p>

 <div className="mt-4 pt-3 border-t border-border/30">
 <p className="text-[10px] font-medium text-muted-foreground italic leading-tight">{kpi.label}</p>
 </div>
 </div>
 ))}
 </div>

 {/* ACTION + ACTIVITY */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

 {/* QUICK ACTIONS */}
 <div className="bg-card border rounded-[2rem] p-8 shadow-sm transition-all hover:shadow-lg animate-in fade-in slide-in-from-left-8 duration-700">
 <h3 className="text-xl font-black italic tracking-tight mb-1">Actions</h3>

 <div className="space-y-4">
 <Link
 to="/department/issues"
 className="flex justify-between items-center w-full p-6 bg-primary text-primary-foreground rounded-2xl font-black tracking-tighter hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all"
 >
 <span>Process Urgent Issues</span>
 <ArrowRight size={20} />
 </Link>

 <Link
 to="/department/zones"
 className="flex justify-between items-center w-full p-6 border rounded-2xl font-black italic tracking-tighter hover:bg-muted transition-all"
 >
 <span>Zone Analytics</span>
 <Activity size={20} />
 </Link>
 </div>
 </div>

 {/* ACTIVITY STREAM */}
 <div className="bg-card border rounded-[2rem] p-8 shadow-sm animate-in fade-in slide-in-from-right-8 duration-700">
 <div className="flex justify-between items-center mb-10">
 <div>
 <h3 className="text-xl font-black italic tracking-tight ">Operational Logs</h3>
 <p className="text-xs text-muted-foreground font-medium">
 Late-breaking system updates
 </p>
 </div>
 <Clock size={18} className="text-muted-foreground opacity-30" />
 </div>

 <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
 {data.activityLogs?.length > 0 ? (
 data.activityLogs.slice(0, 10).map((log, i) => (
 <div key={i} className="flex gap-4 group transition-all duration-300">
 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
 <div className="flex-1">
 <div className="flex justify-between items-center mb-1">
 <p className="text-[10px] font-black text-foreground tracking-widest">{log.action}</p>
 <span className="text-[10px] font-bold text-muted-foreground italic">
 {formatTimeGap(log.timestamp)}
 </span>
 </div>
 <p className="text-[10px] text-muted-foreground italic font-medium leading-relaxed">
 System registered modification on {log.targetModel} identifier.
 </p>
 </div>
 </div>
 ))
 ) : (
 <div className="py-10 text-center opacity-20 italic">
 <Activity size={40} className="mx-auto mb-4" />
 <p className="text-xs font-bold tracking-widest">No active logs detected</p>
 </div>
 )}
 </div>

 <Link
 to="/department/history"
 className="block w-full mt-8 py-3 text-center border-t border-dashed border-border text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary transition-colors"
 >
 Access Complete Archives
 </Link>
 </div>

 </div>

 </div>
 </DepartmentLayout>
 );
};

export default DepartmentDashboard;
