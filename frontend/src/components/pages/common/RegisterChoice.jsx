import { Link } from "react-router-dom";
import { User, Shield, Building2, UserCog, ArrowRight, Activity, Zap } from "lucide-react";
import LandingNavbar from "../../layout/LandingNavbar";
import Footer from "../../layout/Footer";

const RegisterChoice = () => {
 const choices = [
 {
 title: "Citizen Account",
 desc: "Report local issues, track resolution progress, and earn community trust points.",
 link: "/login-citizen",
 icon: User,
 color: "blue",
 },
 {
 title: "System Admin",
 desc: "Supervise municipal nodes, manage user permissions, and oversee platform integrity.",
 link: "/admin-login",
 icon: Shield,
 color: "purple",
 },
 {
 title: "Department Hub",
 desc: "Register your municipal department to manage staff and specialized infrastructure tasks.",
 link: "/department-login",
 icon: Building2,
 color: "emerald",
 },
 {
 title: "Field Operator",
 desc: "Access your dashboard to fulfill assigned tasks and upload verified proof of work.",
 link: "/operator-login",
 icon: UserCog,
 color: "amber",
 },
 ];

 return (
 <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
 <LandingNavbar />

 <div className="flex-1 flex items-center justify-center py-20 px-6 relative overflow-hidden bg-background">
 {/* Abstract Background Elements */}
 <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
 <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
 <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
 </div>

 <div className="max-w-7xl w-full relative z-10">
 {/* Header */}
 <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
 <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
 Identify Your <span className="text-primary">Role</span>
 </h1>
 <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
 Select an interface to interact with the Civic Intelligence Platform. Your choice determines your available tools and platform scope.
 </p>
 </div>

 {/* Cards Grid */}
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
 {choices.map((item, idx) => (
 <Link
 key={item.title}
 to={item.link}
 className="group relative bg-card border border-border rounded-[2.5rem] p-10 hover:border-primary/50 hover:bg-muted/40 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-primary/5 flex flex-col animate-in fade-in zoom-in duration-500 cursor-pointer overflow-hidden"
 style={{ animationDelay: `${idx * 100}ms` }}
 >
 {/* Glow Effect */}
 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[2.5rem]"></div>

 <div className={`w-16 h-16 rounded-2xl bg-${item.color}-600/10 border border-${item.color}-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
 <item.icon className={`w-8 h-8 text-${item.color}-500`} />
 </div>

 <h2 className="text-2xl font-bold text-foreground mb-4 leading-tight">
 {item.title}
 </h2>

 <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed flex-1">
 {item.desc}
 </p>

 <div className="mt-auto">
 <button className={`w-full bg-${item.color}-600/10 hover:bg-${item.color}-600 text-${item.color}-500 hover:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border border-${item.color}-500/20`}>
 Enter Portal
 <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
 </button>
 </div>

 </Link>
 ))}
 </div>

 </div>
 </div>
 <Footer/>

 </div>
 );
};

export default RegisterChoice;

