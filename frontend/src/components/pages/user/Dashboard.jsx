import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout"
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FileText,
    AlertTriangle,
    CheckCircle2,
    Megaphone,
    Asterisk,
    Search,
    MapPin,
    Clock,
    Zap,
    ArrowRight,
    ChevronRight,
    TrendingUp,
} from "lucide-react";

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0 });
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [statsRes, activityRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/issues/stats", config),
                    axios.get("http://localhost:5000/api/issues/all?limit=5", config)
                ]);

                if (statsRes.data.success) setStats(statsRes.data.stats);
                if (activityRes.data.success) setActivity(activityRes.data.issues);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { icon: FileText, label: "Your Total Reports", value: stats.total, badge: "Lifetime", badgeColor: "text-blue-500" },
        { icon: AlertTriangle, label: "Active Issues", value: stats.active, badge: "Pending", badgeColor: "text-amber-500" },
        { icon: CheckCircle2, label: "Resolved Cases", value: stats.resolved, badge: "Completed", badgeColor: "text-emerald-500" },
    ];

    const quickActions = [
        { icon: Megaphone, title: "Report Issue", desc: "Log standard civic faults like potholes or lights.", to: "/post-report", primary: true },
        { icon: Asterisk, title: "Emergency Report", desc: "Urgent hazards requiring local dispatch.", to: "/post-report", primary: true },
        { icon: Search, title: "Global Feed", desc: "Explore and upvote issues across the community.", to: "/community-issues", primary: false },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight transition-colors">System Overview</h1>
                        <p className="text-muted-foreground text-sm font-medium transition-colors opacity-80">Real-time status of your contributions and community activity.</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-2xl shadow-sm transition-colors">
                        <Clock className="h-4 w-4 text-primary transition-colors" />
                        <span className="text-xs font-black text-muted-foreground tracking-widest opacity-60 transition-colors">Live Syncing</span>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-6 md:grid-cols-3 transition-colors">
                    {statCards.map((card, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 shadow-sm relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl transition-colors"></div>
                            <div className="flex items-center justify-between mb-6 relative z-10 transition-colors">
                                <div className="h-12 w-12 rounded-2xl bg-background border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm transition-colors">
                                    <card.icon size={24} />
                                </div>
                                <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full bg-background border border-border transition-colors shadow-sm ${card.badgeColor}`}>
                                    {card.badge}
                                </span>
                            </div>
                            <p className="text-xs font-black text-muted-foreground tracking-widest mb-1 transition-colors opacity-60">{card.label}</p>
                            <h3 className="text-4xl font-black text-foreground tracking-tighter transition-colors">
                                {loading ? "..." : card.value}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 transition-colors">
                    <div className="flex items-center gap-3 transition-colors">
                        <Zap className="h-5 w-5 text-amber-500 fill-amber-500 shadow-glow" />
                        <h2 className="text-xl font-black text-foreground tracking-tight transition-colors">Control Center</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3 transition-colors">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                to={action.to}
                                className={`group relative overflow-hidden rounded-3xl p-8 transition-all transform hover:-translate-y-2 shadow-sm ${action.primary
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/95"
                                    : "bg-card border border-border text-foreground hover:border-primary shadow-lg hover:shadow-primary/5"
                                    }`}
                            >
                                <action.icon className={`h-8 w-8 mb-6 transition-colors transition-transform group-hover:scale-110 ${action.primary ? "text-primary-foreground/80" : "text-primary"}`} />
                                <h3 className="text-xl font-black tracking-tight mb-2 transition-colors tracking-tight">{action.title}</h3>
                                <p className={`text-sm font-medium leading-relaxed transition-colors opacity-90 ${action.primary ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                    {action.desc}
                                </p>
                                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 duration-500">
                                    <ChevronRight size={24} className="text-primary-foreground" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Activity Feed + Insights */}
                <div className="grid gap-8 lg:grid-cols-12 transition-colors">

                    {/* Global Recent Activity */}
                    <div className="lg:col-span-8 rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-2xl transition-colors relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
                        <div className="p-8 border-b border-border bg-muted/20 flex items-center justify-between transition-colors relative z-10">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-success transition-colors" />
                                <h2 className="text-lg font-black text-foreground tracking-tight transition-colors">Community Broadcast</h2>
                            </div>
                            <Link to="/community-issues" className="text-[10px] font-black text-primary tracking-[0.2em] hover:text-foreground transition-all shadow-glow">
                                Explore Feed
                            </Link>
                        </div>

                        <div className="divide-y divide-border relative z-10 transition-colors">
                            {loading ? (
                                <div className="p-10 text-center text-muted-foreground font-black tracking-widest text-[10px] italic transition-colors animate-pulse">Synchronizing Community Stream...</div>
                            ) : activity.length > 0 ? (
                                activity.map((item, i) => (
                                    <div key={i} className="p-8 hover:bg-muted/30 transition-all flex items-center justify-between group cursor-pointer border-transparent hover:border-primary/20">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-2xl bg-background border border-border flex items-center justify-center text-foreground ring-4 ring-transparent group-hover:ring-primary/10 transition-all shadow-inner overflow-hidden shadow-sm">
                                                {item.images?.[0] ? (
                                                    <img src={`http://localhost:5000${item.images[0].url}`} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                                ) : (
                                                    <AlertTriangle size={24} className="text-warning opacity-30 group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[10px] font-black text-primary py-0.5 tracking-widest opacity-80">{item.category?.label || "General"}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-border transition-colors"></div>
                                                    <span className="text-[10px] font-black text-muted-foreground opacity-40 tracking-widest">{item.zone || "Metro Sector-4"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors tracking-tight shadow-glow ">{item.engagement?.upvotes || 0} Criticality</p>
                                            <p className="text-[10px] font-black text-muted-foreground mt-1 opacity-30 tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center text-muted-foreground font-black tracking-widest text-[10px] italic transition-colors opacity-30">Null sector detected in community stream.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;


