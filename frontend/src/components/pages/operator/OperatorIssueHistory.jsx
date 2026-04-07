import React, { useState, useEffect } from "react";
import axios from "axios";
import OperatorLayout from "../../layout/OperatorLayout";
import {
    History,
    Search,
    Filter,
    MapPin,
    Clock,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ArrowRightCircle,
    Eye
} from "lucide-react";
import { format } from "date-fns";

const OperatorIssueHistory = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/issues/operator/issue`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIssues(res.data);
        } catch (err) {
            console.error("History fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredIssues = issues.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue._id.slice(-8).toUpperCase().includes(searchTerm.toUpperCase())
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case "reported": return <AlertCircle className="text-blue-500" size={16} />;
            case "assigned": return <Clock className="text-amber-500" size={16} />;
            case "in_progress": return <ArrowRightCircle className="text-purple-500" size={16} />;
            case "resolved": return <CheckCircle2 className="text-emerald-500" size={16} />;
            case "closed": return <CheckCircle2 className="text-gray-500" size={16} />;
            case "escalated": return <XCircle className="text-red-500" size={16} />;
            default: return <History className="text-gray-400" size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "reported": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "assigned": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "in_progress": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "resolved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "escalated": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const openHistory = (issue) => {
        setSelectedIssue(issue);
        setShowHistoryModal(true);
    };

    return (
        <OperatorLayout>
            <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20" style={{ fontFamily: "Calibri, sans-serif" }}>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-1">
                        <h1 className="text-5xl font-bold tracking-tighter text-foreground leading-none">
                            Issue <span className="text-primary  ">History</span>
                        </h1>
                    </div>

                    <div className="relative group/search w-full md:w-96">
                        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="SCAN MISSION DATABASE..."
                            className="w-full bg-card/30 border border-border pl-14 pr-6 py-4 rounded-2xl font-bold text-[10px] tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* LOADING STATE */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-card/50 border border-border rounded-[2.5rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredIssues.map((issue) => (
                            <div
                                key={issue._id}
                                className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-500"></div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-[10px] text-primary/50 font-bold tracking-widest">
                                            #{(issue._id.slice(-8)).toUpperCase()}
                                        </span>
                                        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-bold tracking-widest ${getStatusColor(issue.status)}`}>
                                            {issue.status}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground   tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                        {issue.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <MapPin size={14} className="text-primary/50" />
                                        <span className="text-[10px] font-bold tracking-widest truncate">{issue.zone || "Operational Zone"}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border/50 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-muted-foreground tracking-widest opacity-40">Deployment</p>
                                        <p className="text-[11px] font-bold text-foreground">{format(new Date(issue.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>

                                    <button
                                        onClick={() => openHistory(issue)}
                                        className="p-4 bg-muted hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all duration-300 group/btn shadow-inner"
                                    >
                                        <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredIssues.length === 0 && (
                    <div className="py-40 text-center space-y-6 bg-card/20 rounded-[3rem] border border-dashed border-border">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <History size={40} className="text-muted-foreground opacity-30" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-[0.5em]">No Mission Records Detected</p>
                    </div>
                )}

                {/* HISTORY MODAL */}
                {showHistoryModal && selectedIssue && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setShowHistoryModal(false)}></div>
                        <div className="bg-card w-full max-w-2xl rounded-[3rem] border border-border shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 animate-in zoom-in-95 duration-500" style={{ fontFamily: "Calibri, sans-serif" }}>

                            {/* MODAL HEADER */}
                            <div className="p-10 border-b border-border bg-muted/30">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-mono text-xs text-primary/50 font-bold tracking-[0.2em]">MISSION AUDIT: #{(selectedIssue._id.slice(-8)).toUpperCase()}</span>
                                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-bold tracking-widest ${getStatusColor(selectedIssue.status)}`}>
                                        {selectedIssue.status}
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-foreground   tracking-tighter">{selectedIssue.title}</h2>
                            </div>

                            {/* TIMELINE */}
                            <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-8">
                                {(!selectedIssue.statusHistory || selectedIssue.statusHistory.length === 0) ? (
                                    <div className="py-10 text-center space-y-4 opacity-50">
                                        <Clock size={32} className="mx-auto text-muted-foreground" />
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Initial System Entry Detected</p>
                                    </div>
                                ) : (
                                    <div className="relative space-y-8 before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                                        {selectedIssue.statusHistory.map((log, index) => (
                                            <div key={index} className="relative pl-12 group">
                                                {/* Dot */}
                                                <div className="absolute left-[5px] top-1.5 w-3.5 h-3.5 rounded-full bg-card border-2 border-primary group-hover:scale-125 transition-transform duration-300"></div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-bold tracking-widest ${getStatusColor(log.status)}`}>
                                                            {getStatusIcon(log.status)}
                                                            {log.status}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-muted-foreground opacity-40">
                                                            {format(new Date(log.updatedAt), 'MMM dd, HH:mm')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-bold text-foreground leading-relaxed   opacity-80 group-hover:opacity-100 transition-opacity">
                                                        "{log.remark || 'Transition authorized by local administrator.'}"
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* MODAL FOOTER */}
                            <div className="p-10 border-t border-border flex justify-end">
                                <button
                                    onClick={() => setShowHistoryModal(false)}
                                    className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-bold text-[10px] tracking-widest transition-all active:scale-95 shadow-glow shadow-primary/20 hover:scale-[1.02]"
                                >
                                    Close Protocol
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </OperatorLayout>
    );
};

export default OperatorIssueHistory;


