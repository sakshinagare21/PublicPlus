import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building2, Mail, Phone, MapPin, Lock, User, BadgeCheck, ShieldCheck, ArrowRight } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import toast from "react-hot-toast";

const DepartmentRegister = () => {
 const navigate = useNavigate();
 const [form, setForm] = useState({
 departmentName: "",
 departmentId: "",
 headName: "",
 officialEmail: "",
 phone: "",
 location: "",
 password: "",
 confirmPassword: "",
 });

 const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (form.password !== form.confirmPassword) {
 toast.error("Passwords do not match");
 return;
 }
 let firebaseUser = null;
 try {
 const userCredential = await createUserWithEmailAndPassword(auth, form.officialEmail, form.password);
 firebaseUser = userCredential.user;
 const token = await firebaseUser.getIdToken(true);

 const response = await fetch("http://localhost:5000/api/departments/register", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify({
 departmentName: form.departmentName,
 departmentCode: form.departmentId,
 description: form.headName,
 contactPhone: form.phone,
 officeAddress: form.location,
 city: "Metropolis", 
 role: "department_admin"
 }),
 });

 const data = await response.json();
 if (!response.ok) throw new Error(data.message);

 toast.success("Registration initiated. Pending system verification.");
 setTimeout(() => navigate("/department-login"), 2000);
 } catch (error) {
 if (firebaseUser) await firebaseUser.delete().catch(() => {});
 toast.error(error.message);
 }
 };

 return (
 <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-500 font-sans selection:bg-primary/30 relative overflow-hidden">
 {/* Background Glows */}
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -translate-x-1/2 translate-y-1/2 transition-colors duration-700"></div>

 <LandingNavbar />

 <div className="flex-1 flex items-center justify-center p-12 lg:p-24 relative z-10 transition-colors">

 <div className="w-full max-w-6xl bg-card border border-border rounded-[3.5rem] p-16 lg:p-24 shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 relative group overflow-hidden">
 <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors"></div>
 
 <div className="text-center mb-16 relative z-10">
 <div className="mx-auto mb-10 w-28 h-28 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10 transition-all hover:scale-110 duration-500 group/icon cursor-pointer">
 <Building2 className="w-14 h-14 text-primary shadow-glow group-hover/icon:rotate-6 transition-all duration-500" />
 </div>
 <h2 className="text-5xl font-black text-foreground mb-4 tracking-tighter transition-colors">Department <span className="text-primary italic">Provisioning</span></h2>
 <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] opacity-40 transition-colors italic">Provision a new tactical municipal node for the intelligence platform</p>
 </div>

 <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
 <div className="space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">Department Name</label>
 <div className="relative group/field">
 <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 name="departmentName"
 placeholder="e.g. PUBLIC_WORKS_DEPT"
 value={form.departmentName}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-4">
 <div className="space-y-4">
 <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">Department Code</label>
 <div className="relative group/field">
 <BadgeCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 name="departmentId"
 placeholder="PWD-Metro-Root"
 value={form.departmentId}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">Description</label>
 <div className="relative group/field">
 <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 name="headName"
 placeholder="Director Name"
 value={form.headName}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm font-medium text-muted-foreground mb-1 ml-2 transition-colors">Official Email</label>
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
 </div></div>
 </div>

 <div className="space-y-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">Mobile</label>
 <div className="relative group/field">
 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 name="phone"
 placeholder="+91-MUNICIPAL-SYNC"
 value={form.phone}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">Location</label>
 <div className="relative group/field">
 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 name="location"
 placeholder="SECTOR_COORD_04"
 value={form.location}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/20 shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">Password</label>
 <div className="relative group/field">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="password"
 name="password"
 placeholder="••••••••"
 value={form.password}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground mb-1 ml-2 opacity-50 transition-colors">VERIFY PASSWORD</label>
 <div className="relative group/field">
 <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within/field:text-primary transition-colors opacity-40" />
 <input
 type="password"
 name="confirmPassword"
 placeholder="••••••••"
 value={form.confirmPassword}
 onChange={handleChange}
 required
 className="w-full bg-muted/30 border border-border rounded-2xl pl-16 pr-6 py-5 text-[11px] font-black tracking-widest text-foreground outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner focus:bg-background"
 />
 </div>
 </div>
 </div>

 <div className="md:col-span-2 mt-8">
 <button
 type="submit"
 className="w-full bg-primary text-primary-foreground py-8 rounded-[2rem] font-black text-[11px] tracking-[0.4em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 shadow-glow shadow-primary/30 flex items-center justify-center gap-4"
 >
 Register
 <ArrowRight size={24} className="animate-pulse" />
 </button>
 </div>

 <div className="md:col-span-2 text-center text-[10px] font-black tracking-[0.3em] text-muted-foreground opacity-30 mt-8 transition-colors">
 <span className="flex items-center justify-center gap-4 py-6 border-t border-border">
 <ShieldCheck size={20} className="text-primary shadow-glow italic" />
 SECURE DATA TRANSMISSION CHANNEL ACTIVE
 </span>
 <p className="mt-8">
 You already Account? <Link to="/department-login" className="text-primary hover:text-foreground transition-all underline underline-offset-4 decoration-border">Access Login Console</Link>
 </p>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
};

export default DepartmentRegister;

