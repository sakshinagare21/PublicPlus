import DepartmentLayout from "../../layout/DepartmentLayout";
import { User, Shield, Github, Globe, Phone, MapPin, Mail, AlertTriangle } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DepartmentProfile = () => {
 const [deptInfo, setDeptInfo] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchDept = async () => {
 try {
 const token = localStorage.getItem("token");
 const res = await axios.get("http://localhost:5000/api/departments/me", {
 headers: { Authorization: `Bearer ${token}` }
 });
 setDeptInfo(res.data);
 } catch (err) {
 toast.error("Failed to load department details");
 console.error(err);
 } finally {
 setLoading(false);
 }
 };
 fetchDept();
 }, []);

 if (loading) {
 return (
 <DepartmentLayout>
 <div className="flex items-center justify-center h-[60vh] text-muted-foreground font-black tracking-[0.3em] animate-pulse">
 Loading department details...
 </div>
 </DepartmentLayout>
 );
 }

 return (
 <DepartmentLayout>
 <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">

 {/* HEADER */}
 <div className="flex justify-between items-end">
 <div className="space-y-1">
 <h1 className="text-4xl font-black tracking-tight text-foreground italic">
 Department <span className="text-primary">Profile</span>
 </h1>
 <p className="text-muted-foreground text-sm font-medium tracking-wide">
 View and manage your department details
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

 {/* LEFT: PROFILE INFO */}
 <div className="lg:col-span-2 space-y-8">
 <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-500" />

 <div className="flex items-center gap-6 mb-10">
 <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-inner rotate-3 hover:rotate-0 transition-transform duration-500">
 {deptInfo?.departmentName?.[0]}
 </div>
 <div>
 <h2 className="text-3xl font-black text-foreground italic border-b-2 border-primary/20 pb-1 mb-2">
 {deptInfo?.departmentName || "Department"}
 </h2>
 <p className="text-muted-foreground text-xs font-black tracking-[0.2em] flex items-center gap-2">
 <Shield size={14} className="text-primary" />
 Verified Department
 </p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">
 Department Code
 </label>
 <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 group cursor-help transition-colors hover:border-primary/30">
 <Github size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
 <span className="text-foreground font-bold tracking-tight">
 {deptInfo?.departmentCode || "Not available"}
 </span>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">
 Email
 </label>
 <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 group cursor-help transition-colors hover:border-primary/30">
 <Mail size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
 <span className="text-foreground font-bold tracking-tight">
 {deptInfo?.email || "Not available"}
 </span>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">
 Contact Number
 </label>
 <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 group cursor-help transition-colors hover:border-primary/30">
 <Phone size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
 <span className="text-foreground font-bold tracking-tight">
 {deptInfo?.contactNumber || "Not available"}
 </span>
 </div>
 </div>

 <div className="space-y-2 md:col-span-2">
 <label className="text-[10px] font-black text-muted-foreground tracking-widest ml-1">
 Address
 </label>
 <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 group cursor-help transition-colors hover:border-primary/30">
 <MapPin size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
 <span className="text-foreground font-bold tracking-tight">
 {deptInfo?.address || "Address not available"}
 </span>
 </div>
 </div>
 </div>

 <div className="mt-10 pt-8 border-t border-border/50">
 <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20">
 Edit Details
 </button>
 </div>
 </div>

 {/* ADDITIONAL STATS */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between">
 <p className="text-[10px] font-black text-muted-foreground tracking-widest">
 Rank
 </p>
 <p className="text-2xl font-black text-foreground italic">
 #4
 </p>
 </div>

 <div className="bg-card p-6 rounded-2xl border border-border flex items-center justify-between">
 <p className="text-[10px] font-black text-muted-foreground tracking-widest">
 Trust Score
 </p>
 <p className="text-2xl font-black text-primary italic">
 98.4
 </p>
 </div>
 </div>
 </div>

 </div>

 </div>
 </DepartmentLayout>
 );
};

export default DepartmentProfile;
