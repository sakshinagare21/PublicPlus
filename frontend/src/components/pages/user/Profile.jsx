import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "axios";
import {
 Edit,
 Share2,
 MapPin,
 CheckCircle2,
 Users,
 Lock,
 Shield,
 Star,
 Megaphone,
 Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const achievements = [
 { icon: Megaphone, label: "Top Reporter", sub: "30+ Verified Reports", unlocked: true },
 { icon: CheckCircle2, label: "Fact Checker", sub: "100 Verifications", unlocked: true },
 { icon: Users, label: "Pillar", sub: "Active for 1 Year", unlocked: true },
 { icon: Lock, label: "Urban Hero", sub: "10 Major Resolutions", unlocked: false },
];

const Profile = () => {
 const [userData, setUserData] = useState(null);
 const [stats, setStats] = useState({ totalReports: 0, resolved: 0, trustScore: 0 });
 const [loading, setLoading] = useState(true);
 const token = localStorage.getItem("token");

 useEffect(() => {
 const loadProfile = async () => {
 try {
 setLoading(true);
 // 1. Get user from localStorage
 const storedUser = JSON.parse(localStorage.getItem("user"));
 if (storedUser) {
 // Depending on response structure, might need storedUser.user
 setUserData(storedUser.user || storedUser);
 }

 // 2. Fetch Live Stats
 const res = await axios.get("http://127.0.0.1:5000/api/analytics/citizen", {
 headers: { Authorization: `Bearer ${token}` }
 });
 
 if (res.data) {
 setStats({
 totalReports: res.data.stats.totalResolved || 0, // Simplified for now
 resolved: res.data.stats.totalResolved || 0,
 trustScore: parseInt(res.data.stats.impactScore?.split("/")[0]) || 0
 });
 }
 } catch (err) {
 console.error("Profile Load Error:", err);
 } finally {
 setLoading(false);
 }
 };

 loadProfile();
 }, [token]);

 if (loading) {
 return (
 <DashboardLayout>
 <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
 <Loader2 className="w-10 h-10 animate-spin text-primary" />
 <p className="text-sm font-black tracking-[0.2em] opacity-60">Synchronizing Identity Node...</p>
 </div>
 </DashboardLayout>
 );
 }

 const user = userData || {};
 const initials = user.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "CU";

 return (
 <DashboardLayout>
 <div className="grid gap-8 lg:grid-cols-5 animate-in fade-in duration-700">

 {/* Main Content */}
 <div className="lg:col-span-3 space-y-8">

 {/* Profile Card */}
 <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl transition-all hover:border-primary/30 relative overflow-hidden group">
 <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] transition-colors"></div>
 
 <div className="relative z-10 flex items-start gap-8 flex-wrap">

 <div className="relative">
 <div className="h-32 w-32 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl font-black text-primary shadow-inner transform transition-all group-hover:scale-105 group-hover:rotate-3 shadow-glow">
 {initials}
 </div>
 <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-success text-success-foreground border-4 border-card flex items-center justify-center shadow-lg shadow-success/20">
 <CheckCircle2 size={20} className="font-black" />
 </div>
 </div>

 <div className="flex-1 space-y-6">
 <div className="flex items-center gap-4 flex-wrap">
 <h1 className="text-4xl font-black text-foreground tracking-tighter">
 {user.fullName || "Citizen User"}
 </h1>

 <div className="flex gap-2">
 <button className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-xl text-xs font-black tracking-widest text-muted-foreground hover:text-foreground hover:border-primary transition-all active:scale-95 shadow-sm">
 <Edit size={14} />
 Edit Profile
 </button>
 <button className="bg-background border border-border p-2 rounded-xl hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm">
 <Share2 size={16} />
 </button>
 </div>
 </div>

 <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground opacity-80">
 <MapPin size={16} className="text-primary" />
 <span>Verified Citizen since {new Date(user.createdAt).getFullYear() || 2024} · {user.email}</span>
 </div>

 <div className="pt-6 border-t border-border flex gap-12">
 {[
 { val: stats.totalReports, label: "TOTAL REPORTS" },
 { val: "98%", label: "VERIF. RATE" },
 { val: stats.resolved, label: "RESOLVED" },
 ].map((s) => (
 <div key={s.label} className="space-y-1 text-center">
 <p className="text-3xl font-black text-foreground tracking-tighter">
 {s.val}
 </p>
 <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground opacity-50">
 {s.label}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Sidebar */}
 <div className="lg:col-span-2 space-y-8">

 {/* Trust Score */}
 <div className="rounded-[2.5rem] border border-border bg-card p-10 text-center shadow-2xl relative overflow-hidden transition-colors">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl transition-colors"></div>
 <h3 className="text-xs font-black text-muted-foreground tracking-[0.2em] mb-8 transition-colors">
 Citizen Trust Score
 </h3>

 <div className="relative mx-auto h-48 w-48 group">
 <svg className="h-full w-full -rotate-90 filter drop-shadow-2xl" viewBox="0 0 120 120">
 <circle cx="60" cy="60" r="50" fill="none" className="stroke-muted" strokeWidth="12" />
 <circle 
 cx="60" cy="60" r="50" fill="none" className="stroke-primary shadow-glow transition-all duration-1000" 
 strokeWidth="12" strokeDasharray="314" strokeDashoffset={314 - (314 * (stats.trustScore/1000))} strokeLinecap="round" 
 />
 </svg>

 <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
 <span className="text-5xl font-black text-foreground tracking-tighter transition-all group-hover:scale-110">
 {stats.trustScore}
 </span>
 <span className="text-[10px] font-black text-primary tracking-widest shadow-glow">
 {stats.trustScore > 800 ? "EXCELLENT" : "STABLE"}
 </span>
 </div>
 </div>

 <p className="mt-8 text-[11px] font-bold text-muted-foreground tracking-widest opacity-70">
 Identity Sector: {user.identificationNumber || "METRO-ID-492"}
 </p>
 </div>

 {/* Security Status */}
 <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl group transition-all">
 <div className="flex items-center gap-3 mb-6">
 <Shield size={20} className="text-primary shadow-glow" />
 <h3 className="text-[10px] font-black tracking-[0.2em] text-primary">
 Security Node
 </h3>
 </div>
 <div className="space-y-4">
 <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border transition-colors">
 <div className="space-y-1">
 <p className="text-[9px] font-black text-muted-foreground tracking-widest">Two-Factor Auth</p>
 <p className="text-xs font-black text-success">ENABLED</p>
 </div>
 <Lock size={16} className="text-muted-foreground opacity-30" />
 </div>
 <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border transition-colors">
 <div className="space-y-1">
 <p className="text-[9px] font-black text-muted-foreground tracking-widest">Last Access</p>
 <p className="text-xs font-black text-foreground">Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
 </div>
 <Activity size={16} className="text-muted-foreground opacity-30" />
 </div>
 </div>
 </div>

 </div>

 </div>
 </DashboardLayout>
 );
};

import { Activity } from "lucide-react";
export default Profile;

