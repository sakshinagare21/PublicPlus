import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Bell, Eye, CheckCircle, Clock } from "lucide-react";
import OperatorLayout from "../../layout/OperatorLayout";

const OperatorNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/notification/operator", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setNotifications(res.data);
        } catch (err) {
            console.error("Fetch notifications error:", err);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put("http://localhost:5000/api/notification/operator/read-all", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("All marked as read");
            fetchNotifications();
        } catch (err) {
            toast.error("Action failed");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <OperatorLayout>
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-end transition-colors relative">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
                    <div className="flex items-center gap-5 transition-colors relative z-10">
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl shadow-xl shadow-primary/5 transition-all">
                            <Bell className="text-primary w-8 h-8 shadow-glow" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter transition-colors ">Intelligence Hub</h1>
                            <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] opacity-60 transition-colors  ">Mission updates and protocol alerts.</p>
                        </div>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="text-[10px] font-black text-primary tracking-[0.2em] hover:text-foreground transition-all shadow-glow pb-2 relative z-10"
                    >
                        Clear Active Feed
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32 transition-colors">
                        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-glow"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-card border border-border rounded-[2.5rem] p-32 text-center shadow-2xl transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 opacity-30 blur-3xl transition-colors"></div>
                        <Bell className="w-16 h-16 text-primary mx-auto mb-8 opacity-20 transition-all group-hover:scale-110 relative z-10" />
                        <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2 transition-colors relative z-10">Quiet Sector</h3>
                        <p className="text-muted-foreground text-xs font-black tracking-widest opacity-40 transition-colors relative z-10">No protocol updates detected in this frequency.</p>
                    </div>
                ) : (
                    <div className="space-y-6 transition-colors">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group hover:scale-[1.02] active:scale-95 ${n.isRead
                                    ? "bg-muted/30 border-border opacity-60 grayscale hover:grayscale-0"
                                    : "bg-card border-primary/20 shadow-2xl shadow-primary/5 hover:border-primary/50"
                                    }`}
                            >
                                {!n.isRead && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary shadow-glow transition-colors"></div>}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 transition-colors">
                                            <h3 className={`text-xl font-black tracking-tight group-hover:text-primary transition-colors ${n.isRead ? "text-foreground" : "text-primary shadow-glow"}`}>
                                                {n.title}
                                            </h3>
                                            {!n.isRead && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-glow" />
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground mb-6 transition-colors opacity-80 leading-relaxed">
                                            {n.message}
                                        </p>

                                        <div className="flex items-center gap-6 transition-colors">
                                            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground opacity-40 transition-colors">
                                                <Clock size={16} className="text-primary opacity-60" />
                                                {new Date(n.createdAt).toLocaleString()}
                                            </div>

                                            {n.issueId && (
                                                <Link
                                                    to={`/operator/tasks/${n.issueId?._id || n.issueId}`}
                                                    className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary hover:text-foreground transition-all shadow-glow bg-primary/5 px-3 py-1 rounded-full border border-primary/10 hover:border-primary/50"
                                                >
                                                    <Eye size={16} />
                                                    TACTICAL FEED: #{(n.issueId?._id || n.issueId).slice(-6)}
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 transition-colors">
                                        <div className={`p-4 rounded-2xl shadow-xl transition-all ${n.type === 'issue_created' ? 'bg-primary/10 text-primary border border-primary/20 shadow-primary/5' :
                                            n.type === 'issue_resolved' ? 'bg-success/10 text-success border border-success/20 shadow-success/5' :
                                                'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-amber-500/5'
                                            }`}>
                                            {n.type === 'issue_created' ? <Eye size={24} className="shadow-glow" /> :
                                                n.type === 'issue_resolved' ? <CheckCircle size={24} className="shadow-glow-success" /> :
                                                    <Bell size={24} className="shadow-glow-amber" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </OperatorLayout>
    );
};

export default OperatorNotifications;

