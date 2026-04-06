import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "axios";
import {
    ArrowBigUp,
    ArrowBigDown,
    MessageSquare,
    MapPin,
    Clock,
    Search,
    Filter,
    AlertTriangle,
    ChevronRight,
    User,
    Zap,
    CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const CommunityIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [votedIssues, setVotedIssues] = useState({}); // Tracking local vote status

    useEffect(() => {
        fetchIssues();
    }, [search]);

    const fetchIssues = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/api/issues/all?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setIssues(res.data.issues);
                // Sync local voted status with backend data
                const voteMap = {};
                res.data.issues.forEach(i => {
                    if (i.userVote) voteMap[i._id] = i.userVote === "upvote" ? "up" : "down";
                });
                setVotedIssues(voteMap);
            }
        } catch (error) {
            toast.error("Failed to load community stream");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id, type) => {
        try {
            const token = localStorage.getItem("token");
            const endpoint = type === "up" ? "upvote" : "downvote";
            const res = await axios.post(`http://localhost:5000/api/issues/${id}/${endpoint}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                // Update local state for immediate feedback
                setIssues(prev => prev.map(issue => {
                    if (issue._id === id) {
                        return {
                            ...issue,
                            engagement: {
                                ...issue.engagement,
                                upvotes: res.data.upvotes,
                                downvotes: res.data.downvotes
                            }
                        };
                    }
                    return issue;
                }));

                setVotedIssues(prev => {
                    const newState = { ...prev };
                    if (res.data.userVote) {
                        newState[id] = res.data.userVote === "upvote" ? "up" : "down";
                    } else {
                        delete newState[id];
                    }
                    return newState;
                });

                if (res.data.userVote) {
                    toast.success(res.data.userVote === "upvote" ? "Upvoted!" : "Downvoted");
                } else {
                    toast.success("Vote Removed");
                }
            }
        } catch (error) {
            toast.error("You must be logged in to vote");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* Search & Filter Header */}
                <div className="relative group rounded-[2rem] border border-border bg-card p-10 overflow-hidden shadow-2xl transition-colors">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-xl">
                            <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2 transition-colors">All Issues</h1>
                            <p className="text-muted-foreground font-medium leading-relaxed transition-colors opacity-80">
                                Real-time collective surveillance. Upvote critical failures to prioritize them in the municipal queue.
                            </p>
                        </div>

                        <div className="flex-1 max-w-md w-full relative">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-muted-foreground transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Scan archives or find recent faults..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-background border border-border py-5 pl-14 pr-6 rounded-2xl text-foreground font-bold text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none transition-colors placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>
                </div>

                {/* Issue Stream */}
                <div className="grid gap-6">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center text-muted-foreground transition-colors">
                            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-black text-xs tracking-widest opacity-70">Synchronizing Global Feed...</p>
                        </div>
                    ) : issues.length > 0 ? (
                        issues.map((issue) => (
                            <div key={issue._id} className="group relative rounded-[2rem] border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-500">
                                <div className="flex flex-col lg:flex-row">

                                    {/* Voting Track */}
                                    <div className="bg-muted/30 lg:w-20 p-6 flex lg:flex-col items-center justify-center gap-4 border-r border-border/50 transition-colors">
                                        <button
                                            onClick={() => handleVote(issue._id, "up")}
                                            className={`p-2 rounded-xl border border-border transition-all ${votedIssues[issue._id] === "up" ? "bg-success/20 border-success/50 text-success" : "hover:border-success/30 text-muted-foreground hover:text-success"}`}
                                        >
                                            <ArrowBigUp size={28} />
                                        </button>
                                        <span className="font-black text-foreground text-lg tracking-tighter transition-colors">
                                            {(issue.engagement?.upvotes || 0) - (issue.engagement?.downvotes || 0)}
                                        </span>
                                        <button
                                            onClick={() => handleVote(issue._id, "down")}
                                            className={`p-2 rounded-xl border border-border transition-all ${votedIssues[issue._id] === "down" ? "bg-destructive/20 border-destructive/50 text-destructive" : "hover:border-destructive/30 text-muted-foreground hover:text-destructive"}`}
                                        >
                                            <ArrowBigDown size={28} />
                                        </button>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 p-8">
                                        <div className="flex items-center gap-3 mb-4 flex-wrap">

                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest leading-none shadow-sm transition-colors border ${issue.status === 'resolved' ? 'bg-success/10 text-success border-success/20' :
                                                issue.status === 'closed' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                                                    issue.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        issue.status === 'escalated' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            'bg-primary/10 text-primary border-primary/20'
                                                }`}>
                                                {issue.status?.replace('_', ' ')}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors tracking-widest">
                                                <MapPin size={10} className="text-success" />
                                                {issue.zone}
                                            </div>
                                            <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground transition-colors tracking-widest">
                                                <Clock size={10} />
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-black text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors">
                                            {issue.title}
                                        </h2>
                                        <p className="text-muted-foreground transition-colors font-medium leading-relaxed line-clamp-2 mb-6 opacity-80">
                                            {issue.description?.text}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-border transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center transition-colors">
                                                    <User size={12} className="text-primary" />
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground transition-colors opacity-70">{issue.reportedBy?.fullName || "Citizen Analyst"}</span>
                                            </div>

                                            <div className="flex items-center gap-4 ml-auto">
                                                <Link to={`/issue/${issue._id}`} className="bg-background border border-border px-6 py-2 rounded-xl text-[10px] font-black tracking-widest text-foreground hover:border-primary transition-all flex items-center gap-2 shadow-sm">
                                                    Inspect Data <ChevronRight size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Context */}
                                    {issue.images?.[0] && (
                                        <div className="lg:w-72 border-l border-border/50 relative overflow-hidden group/img">
                                            <img
                                                src={`http://localhost:5000${issue.images[0].url}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                                alt="Issue Context"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-colors"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md`}>
                                                    {issue.status === "resolved" ? (
                                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                                    ) : issue.status === "in_progress" ? (
                                                        <Zap size={12} className="text-amber-500" />
                                                    ) : (
                                                        <AlertTriangle size={12} className="text-blue-500" />
                                                    )}
                                                    <span className="text-[10px] font-black tracking-tighter text-white">
                                                        {issue.status?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-card border border-border rounded-[2rem] p-20 text-center transition-colors shadow-sm">
                            <Filter className="h-12 w-12 text-muted-foreground transition-colors mx-auto mb-6 opacity-30" />
                            <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2 transition-colors">Null Sector Detected</h3>
                            <p className="text-muted-foreground font-medium transition-colors opacity-60">No community broadcasts match your criteria. Expand your scan range.</p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default CommunityIssues;

