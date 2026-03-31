import { useState } from "react";
import { Eye, EyeOff, LayoutDashboard, Truck, ShieldCheck, Mail, Lock } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

const OperatorLogin = () => {
 const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);
 const [form, setForm] = useState({
 email: "",
 password: "",
 remember: false
 });

 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;
 setForm({
 ...form,
 [name]: type === "checkbox" ? checked : value
 });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 try {
 const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
 const user = userCredential.user;
 const token = await user.getIdToken();
 const res = await fetch("http://localhost:5000/api/operator/login", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`
 }
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.message);
 localStorage.setItem("token", token);
 toast.success("Login successful");
 navigate("/operator/dashboard");
 } catch (err) {
 toast.error(err.message);
 }
 };

 return (
 <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
 {/* Background Glows */}
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 transition-colors duration-700"></div>

 <LandingNavbar />

 <div className="flex-1 flex items-center justify-center p-12 lg:p-24 relative z-10 transition-colors">
 <div className="w-full max-w-2xl bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative">
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] transition-colors"></div>
 
 <div className="p-16 lg:p-24">
 <div className="flex flex-col items-center mb-16 text-center">
 <div className="w-28 h-28 bg-primary/5 border border-primary/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-primary/10 transition-all hover:scale-110 duration-500 group/icon cursor-pointer relative overflow-hidden">
 <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
 <Truck className="w-14 h-14 text-primary shadow-glow group-hover/icon:rotate-6 transition-all duration-500" />
 </div>
 <h1 className="text-4xl font-black text-foreground tracking-tighter transition-colors mb-4">Operator <span className="text-primary italic">Login</span></h1>
 <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] opacity-40 transition-colors italic max-w-xs">
 Authentication for Operator Login
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-4 transition-colors">
 <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
 Operator Official Email Address
 </label>
 <div className="relative group/field">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="email"
 name="email"
 placeholder="operator@command.logistics"
 value={form.email}
 onChange={handleChange}
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
 required
 />
 </div>
 </div>

 <div className="space-y-4 transition-colors">
 <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
 Password
 </label>
 <div className="relative group/field">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type={showPassword ? "text" : "password"}
 name="password"
 placeholder="••••••••••••"
 value={form.password}
 onChange={handleChange}
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-16 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
 required
 />
 </div>
 </div>

 <div className="flex items-center justify-between px-2 text-[10px] font-black tracking-widest transition-colors">
 <label className="flex items-center gap-3 text-muted-foreground cursor-pointer select-none group/check">
 <input
 type="checkbox"
 name="remember"
 checked={form.remember}
 onChange={handleChange}
 className="w-5 h-5 rounded-lg border-border bg-muted/50 checked:bg-primary transition-all cursor-pointer"
 />
 <span className="opacity-40 group-hover/check:opacity-100 transition-opacity">Accept term and conditions</span>
 </label>

 <Link to="/operator-forgot-password" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">Forgot Password</Link>
 </div>

 <button
 type="submit"
 className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-black text-[11px] tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/20"
 >
 LOGIN
 </button>
 </form>

 <div className="mt-16 pt-16 border-t border-border text-center space-y-12 transition-colors">
 <div>
 <p className="text-[10px] font-black tracking-widest text-muted-foreground opacity-30 transition-colors mb-2">
 GO TO HOME <Link to="/" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">Abort Portal</Link>
 </p>
 <p className="text-[9px] font-black tracking-[0.2em] text-muted-foreground opacity-40 transition-colors">
 NEW OPERATOR? <Link to="/operator-register" className="text-amber-500 font-black hover:text-foreground transition-all italic">Submit Application</Link>
 </p>
 </div>

 <div className="space-y-8">
 <p className="text-[9px] font-black tracking-[0.4em] text-muted-foreground opacity-20 transition-colors">
 Switch ROLE
 </p>
 <div className="grid grid-cols-3 gap-4">
 <Link to="/login-citizen" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95">
 CITIZEN
 </Link>
 <Link to="/department-login" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all active:scale-95">
 DEPT
 </Link>
 <Link to="/admin-login" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-purple-500 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all active:scale-95">
 ADMIN
 </Link>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default OperatorLogin;

