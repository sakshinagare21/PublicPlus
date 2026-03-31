import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, Mail, Lock, Activity, Globe } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

const AdminLogin = () => {
 const navigate = useNavigate();
 const [form, setForm] = useState({
 email: "",
 password: "",
 });
 const [loading, setLoading] = useState(false);

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 try {
 const userCredential = await signInWithEmailAndPassword(
 auth,
 form.email,
 form.password
 );
 const token = await userCredential.user.getIdToken();
 const response = await fetch("http://127.0.0.1:5000/api/admin/dashboard", {
 headers: { Authorization: `Bearer ${token}` }
 });
 if (!response.ok) throw new Error("You are not authorized as admin");
 const data = await response.json();
 localStorage.setItem("token", token);
 localStorage.setItem("admin", JSON.stringify(data));
 toast.success("Admin login successful");
 setTimeout(() => navigate("/admin"), 1000);
 } catch (error) {
 toast.error(error.message);
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30">
 <LandingNavbar />

 <div className="flex flex-1 items-center justify-center p-8 lg:p-12 bg-background transition-colors relative overflow-hidden">
 {/* Abstract Background Shapes */}
 <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 transition-colors duration-700"></div>
 <div className="flex w-full max-w-6xl rounded-[3rem] overflow-hidden border border-border shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative z-10 bg-card group/container">
 
 {/* LEFT PANEL - COMMAND CENTER AESTHETIC */}
 <div className="hidden lg:flex w-1/2 bg-muted/30 p-16 flex-col justify-between border-r border-border backdrop-blur-3xl relative overflow-hidden transition-colors">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-colors"></div>
 <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -ml-32 -mb-32 transition-colors"></div>
 
 <div className="relative z-10">
 <div className="flex items-center gap-3 text-primary font-black tracking-[0.3em] text-[10px] mb-8 transition-colors shadow-glow w-fit">
 <Activity size={18} className="animate-pulse" />
 SECURE COMMAND PROTOCOL
 </div>
 <h2 className="text-5xl font-black mb-8 leading-[1.1] text-foreground tracking-tighter transition-colors">
 Strategic <br/>
 <span className="text-primary italic shadow-glow">Civil OS</span>
 </h2>
 <p className="text-muted-foreground leading-relaxed font-black text-[11px] tracking-widest opacity-60 max-w-xs transition-colors italic">
 Complete oversight of municipal logistics and infrastructure grid.
 </p>
 </div>

 <div className="space-y-6 relative z-10 transition-colors">
 <div className="bg-background/50 border border-border rounded-3xl p-8 backdrop-blur-md shadow-inner transition-colors group/stats hover:bg-background/80">
 <p className="text-primary font-black text-5xl tabular-nums tracking-tighter shadow-glow transition-colors mb-2">
 99.99%
 </p>
 <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] opacity-40 transition-colors">
 Real-time System Uptime
 </p>
 </div>
 <div className="flex items-center gap-6 text-[10px] font-black tracking-widest text-muted-foreground opacity-40 transition-colors">
 <span className="flex items-center gap-2"><Globe size={16} className="text-primary" /> Node: Mumbai-v2</span>
 <span className="flex items-center gap-2"><Shield size={16} className="text-primary" /> End-to-End Encrypted</span>
 </div>
 </div>
 </div>

 {/* RIGHT PANEL - LOGIN FORM */}
 <div className="flex-1 bg-card p-16 lg:p-24 flex items-center transition-all duration-500 relative overflow-hidden">
 <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors"></div>
 <div className="w-full max-w-md mx-auto relative z-10">
 <div className="text-center mb-12">
 <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 transition-all hover:scale-110 duration-500 group/icon cursor-pointer">
 <Shield className="w-12 h-12 text-primary shadow-glow group-hover/icon:animate-bounce transition-all duration-700" />
 </div>
 <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter transition-colors">
 Admin <span className="text-primary italic">Access</span>
 </h2>
 <p className="text-sm text-muted-foreground font-medium opacity-60">
 Login to your admin account
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-3">
 <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
 Email Address
 </label>
 <div className="relative group/field">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="email"
 name="email"
 placeholder="admin@example.com"
 value={form.email}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/40 text-sm font-medium shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-3">
 <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
 Password
 </label>
 <div className="relative group/field">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="password"
 name="password"
 placeholder="••••••••••••"
 value={form.password}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/40 text-sm font-medium shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="flex items-center justify-between text-[10px] font-black tracking-widest transition-colors mb-2">
 <label className="flex items-center gap-3 text-muted-foreground cursor-pointer select-none group/check">
 <input type="checkbox" className="w-5 h-5 rounded-lg border-border bg-muted/50 checked:bg-primary transition-all cursor-pointer" />
 <span className="opacity-40 group-hover/check:opacity-100 transition-opacity">Stay Authenticated</span>
 </label>
 <Link to="/" className="text-primary hover:text-foreground transition-all shadow-glow opacity-80 hover:opacity-100 italic">
 Lost Keycard?
 </Link>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/30 mt-4 disabled:opacity-50"
 >
 {loading ? "Logging in..." : "Login"}
 </button>

 <div className="pt-10 border-t border-border transition-colors">
 <p className="text-center text-[9px] font-black tracking-[0.3em] text-muted-foreground mb-6 opacity-30 transition-colors">
 Switch Tactical Portal
 </p>
 <div className="grid grid-cols-3 gap-4">
 <Link to="/login-citizen" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95">
 CITIZEN
 </Link>
 <Link to="/operator-login" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all active:scale-95">
 OPERATOR
 </Link>
 <Link to="/department-login" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all active:scale-95">
 DEPT
 </Link>
 </div>
 </div>

 <p className="text-center text-[10px] font-black tracking-widest text-muted-foreground opacity-30 transition-colors">
 Unauthorized access is <span className="text-destructive opacity-80">strictly monitored</span>. <Link to="/" className="text-primary hover:text-foreground transition-colors mx-1 underline underline-offset-4 decoration-border">Return Base</Link>
 </p>
 </form>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default AdminLogin;

