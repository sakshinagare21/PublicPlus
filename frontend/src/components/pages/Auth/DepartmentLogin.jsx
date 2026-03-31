import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building2, Mail, Lock, BadgeCheck, CheckCircle, ShieldCheck } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

const DepartmentLogin = () => {
 const navigate = useNavigate();
 const [form, setForm] = useState({
 officialEmail: "",
 password: "",
 });

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 try {
 const userCredential = await signInWithEmailAndPassword(
 auth,
 form.officialEmail,
 form.password
 );
 const token = await userCredential.user.getIdToken(true);
 const response = await fetch("http://127.0.0.1:5000/api/departments/login", {
 method: "POST",
 headers: { Authorization: `Bearer ${token}` }
 });
 const data = await response.json();
 if (!response.ok) throw new Error(data.message);
 localStorage.setItem("department", JSON.stringify(data.department));
 localStorage.setItem("token", token);
 toast.success("Login successful");
 navigate("/department/dashboard");
 } catch (error) {
 toast.error(error.message);
 }
 };

 return (
 <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
 {/* Background Glows */}
 <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
 <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 transition-colors duration-700"></div>
 
 <LandingNavbar />

 <div className="flex-1 flex items-center justify-center p-12 lg:p-24 relative z-10 transition-colors">
 <div className="w-full max-w-xl rounded-[3rem] overflow-hidden border border-border shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative z-10 bg-card group/container">
 
 {/* LOGIN FORM */}
 <div className="bg-card p-16 lg:p-24 flex items-center transition-all duration-500 relative overflow-hidden">
 <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors"></div>
 <div className="w-full max-w-md mx-auto relative z-10">
 <div className="text-center mb-16">
 <div className="mx-auto mb-10 w-24 h-24 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 transition-all hover:scale-110 duration-500 group/icon cursor-pointer relative overflow-hidden">
 <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/icon:opacity-100 transition-opacity"></div>
 <Building2 className="w-12 h-12 text-primary shadow-glow group-hover/icon:animate-bounce transition-all duration-700" />
 </div>
 <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter transition-colors">
 Department <span className="text-primary italic">Login</span>
 </h2>
 <p className="text-sm text-muted-foreground font-medium opacity-60">
 Authorized personnel only
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-4 transition-colors">
 <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
 Department Code
 </label>
 <div className="relative group/field">
 <BadgeCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="text"
 name="departmentCode"
 placeholder="Enter Dept-ID"
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
 required
 />
 </div>
 </div>

 <div className="space-y-4 transition-colors">
 <label className="block text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">
 Official Email
 </label>
 <div className="relative group/field">
 <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="email"
 name="officialEmail"
 placeholder="contact@dept.gov"
 value={form.officialEmail}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
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
 type="password"
 name="password"
 placeholder="••••••••••••"
 value={form.password}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <button
 type="submit"
 className="w-full bg-primary text-primary-foreground py-6 rounded-2xl font-bold text-sm transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/20"
 >
 Login
 </button>

 <div className="relative py-4 transition-colors">
 <div className="absolute inset-0 flex items-center transition-colors"><div className="w-full border-t border-border mt-6"></div></div>
 <div className="relative flex justify-center text-[9px] font-black tracking-[0.4em] opacity-20"><span className="bg-card px-4 mt-6">Other Options</span></div>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-8">
 <Link to="/department-register" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95">
 Register
 </Link>
 <Link to="/" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95">
 SUPPORT LINK
 </Link>
 </div>

 <div className="pt-12 border-t border-border transition-colors mt-8">
 <p className="text-center text-[10px] font-black tracking-[0.4em] text-muted-foreground mb-8 opacity-20 transition-colors">
 Switch Logical Stream
 </p>
 <div className="grid grid-cols-3 gap-4">
 <Link to="/login-citizen" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-95">
 CITIZEN
 </Link>
 <Link to="/operator-login" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all active:scale-95">
 OPERATOR
 </Link>
 <Link to="/admin-login" className="text-center py-4 bg-muted/30 border border-border rounded-2xl text-[10px] font-black tracking-widest text-muted-foreground hover:text-purple-500 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all active:scale-95">
 ADMIN
 </Link>
 </div>
 </div>
 </form>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default DepartmentLogin;

