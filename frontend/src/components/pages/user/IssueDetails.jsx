import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layout/DashboardLayout";

import {
    ArrowLeft,
    MapPin,
    CheckCircle2,
    AlertTriangle,
    Star,
    RefreshCcw,
    Image as ImageIcon,
    FileText,
    Clock,
    Building2,
    User
} from "lucide-react";

const getStatusBadge = (status) => {
    const config = {
        reported: { label: "Logged", colors: "border-blue-500/50 text-blue-500 bg-blue-500/10" },
        assigned: { label: "Dispatched", colors: "border-amber-500/50 text-amber-500 bg-amber-500/10" },
        in_progress: { label: "Under Maintenance", colors: "border-purple-500/50 text-purple-500 bg-purple-500/10" },
        pending_verification: { label: "Awaiting Certification", colors: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" },
        resolved: { label: "Mission Resolved", colors: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" },
        reopened: { label: "Disputed", colors: "border-red-500/50 text-red-500 bg-red-500/10" },
    }[status] || { label: status, colors: "border-gray-500/50 text-gray-500 bg-gray-500/10" };

    return (
        <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-widest border ${config.colors}`}>
            {config.label}
        </div>
    );
};

const IssueDetail = () => {
    const { issueId } = useParams();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);

    // Rating State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verification Image (Accept proof)
    const [verificationImage, setVerificationImage] = useState(null);

    // Reopen State
    const [showReopenModal, setShowReopenModal] = useState(false);
    const [rejectionProof, setRejectionProof] = useState(null);

    const token = localStorage.getItem("token");

    /* ================= FETCH ISSUE ================= */
    const fetchIssue = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/issues/${issueId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIssue(res.data);
            if (res.data.rating) setRating(res.data.rating); // Pre-fill if already rated
            setLoading(false);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load issue");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssue();
    }, [issueId]);

    /* ================= ACTIONS ================= */
    const handleVerify = async () => {
        if (rating === 0) {
            toast.error("Please provide a rating before verifying!");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("rating", rating);
            if (verificationImage) {
                formData.append("verificationImage", verificationImage);
            }

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/issues/${issueId}/verify`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            toast.success("Issue verified and closed!");
            fetchIssue();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to verify issue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReopen = async (e) => {
        e.preventDefault();
        if (!rejectionProof) {
            toast.error("Please provide an image showing the issue is not solved.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("proof", rejectionProof);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/issues/${issueId}/reopen`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            toast.success("Issue has been reopened and proof submitted.");
            setShowReopenModal(false);
            fetchIssue();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reopen issue");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div className="flex h-64 items-center justify-center text-muted-foreground animate-pulse font-black tracking-widest text-xs">Loading Incident Intelligence...</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between">
                    <Link to="/reports" className="group flex items-center gap-2 text-xs font-black tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Registry
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-2xl">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] font-black text-muted-foreground tracking-widest leading-none">Live Incident Monitoring</span>
                    </div>
                </div>

                {/* HEADER & STATUS */}
                <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl transition-colors">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] transition-colors"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-background border border-border px-3 py-1 rounded-full text-[10px] font-black text-primary tracking-widest">
                                    ISSUE #{issue._id.slice(-6).toUpperCase()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border transition-colors ${issue.priority?.level === 'critical' ? 'border-destructive text-destructive bg-destructive/10' :
                                    issue.priority?.level === 'high' ? 'border-amber-500/50 text-amber-500 bg-amber-500/10' :
                                        'border-success/50 text-success bg-success/10'
                                    }`}>
                                    {issue.priority?.level || 'Standard'} Priority
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-foreground tracking-tighter">{issue.title}</h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                    <MapPin size={16} className="text-emerald-500" />
                                    <span className=" tracking-tight">{issue.zone}</span>
                                </div>
                                {issue.fullAddress && (
                                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                        <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                                        <span className="line-clamp-1">{issue.fullAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            <div className="bg-background border border-border p-2 rounded-2xl">
                                {getStatusBadge(issue.status)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION BANNER: PENDING VERIFICATION */}
                {issue.status === "pending_verification" && (
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-primary/5 p-10 shadow-2xl animate-in zoom-in-95 duration-500 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-600 to-primary animate-pulse"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">Resolution Verification</h2>
                                    <p className="text-muted-foreground font-medium leading-relaxed">
                                        Operator <strong>{issue.assignedTo?.fullName || "Assigned Unit"}</strong> has reported a successful resolution. Inspect the visual proof and certify the completion.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        onClick={handleVerify}
                                        disabled={isSubmitting || rating === 0}
                                        className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground px-8 py-4 rounded-2xl font-black tracking-widest text-xs transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-2"
                                    >
                                        Authorize Completion <CheckCircle2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setShowReopenModal(true)}
                                        disabled={isSubmitting}
                                        className="bg-background border border-border text-muted-foreground hover:text-foreground hover:border-destructive/50 px-8 py-4 rounded-2xl font-black tracking-widest text-xs transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        Reject Closure <RefreshCcw size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-background group/img shadow-2xl">
                                    {issue.resolution?.proof?.url ? (
                                        <>
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}${issue.resolution.proof.url}`}
                                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                                                alt="Visual Proof"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                                            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                                <div className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur-md border border-border text-[10px] font-black tracking-widest text-primary-foreground shadow-sm transition-colors">
                                                    Operator Proof
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 space-y-4 transition-colors">
                                            <ImageIcon size={48} className="opacity-20" />
                                            <p className="text-xs font-black tracking-widest">Metadata Only - No Visuals</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-background/50 border border-border rounded-3xl p-8 space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-4 block">Unit Performance Review</label>
                                        <div className="flex gap-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className="transition-all hover:scale-125 focus:outline-none"
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                >
                                                    <Star
                                                        size={32}
                                                        className={`transition-all ${star <= (hoverRating || rating) ? "fill-amber-500 text-amber-500" : "text-muted"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative group/upload">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setVerificationImage(e.target.files[0])}
                                            className="hidden"
                                            id="verify-image-upload"
                                        />
                                        <label htmlFor="verify-image-upload" className="w-full cursor-pointer flex items-center justify-between p-4 bg-background border border-border rounded-2xl group-hover/upload:border-primary/50 transition-all">
                                            <div className="flex items-center gap-3">
                                                <ImageIcon size={18} className={verificationImage ? "text-primary" : "text-muted-foreground"} />
                                                <span className={`text-xs font-bold ${verificationImage ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                    {verificationImage ? verificationImage.name : 'Attach Inspection Evidence'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black text-primary tracking-widest">Browse</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DETAILS GRID */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Description Strategy */}
                        <div className="rounded-[2rem] border border-border bg-card overflow-hidden">
                            <div className="p-8 border-b border-border bg-muted/30">
                                <h2 className="text-xl font-black text-foreground tracking-tight flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    Incident Report
                                </h2>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <p className="text-[20px] font-black text-primary">Citizen Observation Brief</p>
                                    <div className="bg-background border border-border rounded-3xl p-8 relative group">
                                        <div className="absolute top-4 right-4 text-muted opacity-20"><FileText size={40} /></div>
                                        <p className="text-muted-foreground font-medium leading-relaxed text-lg  ">
                                            "{issue.description?.text}"
                                        </p>
                                    </div>
                                </div>

                                {issue.images?.length > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-[20px] font-black text-primary uppercase">Issue Image</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {issue.images.map((img, i) => (
                                                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border group relative transition-colors">
                                                    <img
                                                        src={img.url ? (img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL}${img.url.startsWith('/') ? '' : '/'}${img.url}`) : '/placeholder-image.png'}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found'; }}
                                                    />
                                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RESOLVED PROOF (If Resolved) */}
                        {issue.status === "resolved" && issue.resolution?.proof?.url && (
                            <div className="rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/5 p-10 overflow-hidden relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                    <div className="w-full md:w-64 aspect-square rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl">
                                        <img
                                            src={issue.resolution.proof.url.startsWith('http') ? issue.resolution.proof.url : `${import.meta.env.VITE_API_BASE_URL}${issue.resolution.proof.url}`}
                                            className="w-full h-full object-cover"
                                            alt="Final Resolution"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4 text-center md:text-left">
                                        <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center justify-center md:justify-start gap-3">
                                            <CheckCircle2 className="text-emerald-500" /> Resolution Data
                                        </h2>
                                        <p className="text-emerald-500/70 font-bold tracking-widest text-xs">Mission Certified & Closed</p>
                                        <div className="pt-4 border-t border-emerald-500/10">
                                            <p className="text-muted-foreground font-medium">Citizen Performance Rating</p>
                                            <div className="flex justify-center md:justify-start gap-2 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={20} className={i < issue.rating ? "fill-amber-500 text-amber-500" : "text-muted"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info (Right) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="rounded-[2rem] border border-border bg-card p-8 overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                            <div className="space-y-8">
                                <div className="group">
                                    <p className="text-[10px] font-black text-muted-foreground tracking-widest mb-1 group-hover:text-primary transition-colors">Strategic Node</p>
                                    <p className="text-foreground font-black tracking-tight ">{issue.zone || "Metro Central"}</p>
                                </div>

                                <div className="flex items-center gap-4 py-6 border-y border-border">
                                    <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Division</p>
                                        <p className="text-sm font-black text-foreground">{issue.assignedDepartment?.departmentName || "General Municipal"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-emerald-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Field operative</p>
                                        <p className="text-sm font-black text-foreground">{issue.assignedTo?.fullName || "Awaiting Deployment"}</p>
                                    </div>
                                </div>

                                <div className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-muted-foreground" />
                                            <span className="text-[10px] font-bold text-muted-foreground ">Registered</span>
                                        </div>
                                        <span className="text-[10px] font-black text-foreground">{new Date(issue.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {issue.sla?.resolutionDeadline && (
                                        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-red-500" />
                                                <span className="text-[10px] font-bold text-red-500 ">Target SLA</span>
                                            </div>
                                            <span className="text-[10px] font-black text-red-500">{new Date(issue.sla.resolutionDeadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* REOPEN MODAL (DARK THEME) */}
            {showReopenModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-background/80 animate-in fade-in duration-300 transition-colors">
                    <div className="bg-card border border-border rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500">
                        <div className="p-10 space-y-8">
                            <div className="space-y-2 text-center">
                                <h3 className="text-3xl font-black text-foreground tracking-tighter">Initiate Re-Scan</h3>
                                <p className="text-muted-foreground font-medium text-sm">Provide categorical evidence that the infrastructure failure persists.</p>
                            </div>

                            <form onSubmit={handleReopen} className="space-y-8">
                                <div className="relative group/field border-2 border-dashed border-border rounded-3xl p-10 flex flex-col items-center justify-center hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer bg-background">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setRejectionProof(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        id="rejection-upload"
                                    />
                                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4 group-hover/field:scale-110 transition-transform">
                                        <AlertTriangle className={rejectionProof ? "text-destructive" : "text-muted"} size={28} />
                                    </div>
                                    <p className="text-foreground font-bold">{rejectionProof ? rejectionProof.name : 'Select Artifact'}</p>
                                    <p className="text-[8px] text-muted mt-2 tracking-[0.2em] font-black">Visual Proof Required</p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowReopenModal(false)}
                                        className="flex-1 bg-background border border-border text-muted-foreground py-4 rounded-2xl font-black tracking-widest text-[10px] hover:text-foreground transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!rejectionProof || isSubmitting}
                                        className="flex-1 bg-destructive hover:bg-destructive/90 disabled:bg-muted disabled:text-muted-foreground text-destructive-foreground py-4 rounded-2xl font-black tracking-widest text-[10px] transition-all shadow-xl shadow-destructive/20 active:scale-95"
                                    >
                                        {isSubmitting ? "TRANSMITTING..." : "OPEN DISPUTE"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default IssueDetail;


