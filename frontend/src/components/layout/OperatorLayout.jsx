import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import FAQChatbot from "../common/FAQChatbot";
import { useEffect, useState } from "react";
import {
 LayoutDashboard,
 ClipboardList,
 FileText,
 Camera,
 User,
 LogOut,
 Search,
 Bell
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const OperatorLayout = ({ children }) => {
 const { logout } = useAuth();
 const navigate = useNavigate();
 const [operator, setOperator] = useState(null);

 /* ================= FETCH OPERATOR ================= */
 const fetchOperator = async () => {
 try {
 const res = await axios.get(
 "http://localhost:5000/api/operator/profile",
 {
 headers: {
 Authorization: `Bearer ${localStorage.getItem("token")}`,
 },
 },
 );

 setOperator(res.data);
 } catch (err) {
 console.error("Operator fetch error:", err);
 }
 };

 useEffect(() => {
 fetchOperator();
 }, []);

 /* ================= LOGOUT ================= */
 const handleLogout = () => {
 logout();
 window.location.href = "/operator-login";
 };

 return (
 <div className="flex h-screen bg-background text-foreground transition-colors duration-300">

 {/* ===== SIDEBAR ===== */}
 <aside className="w-80 bg-card border-r border-border flex flex-col relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

 {/* Logo */}
 <div className="p-10 border-b border-border relative z-10">
 <h1 className="text-3xl font-bold text-foreground">
 Public<span className="text-primary">Plus</span>
 </h1>
 <p className="text-sm text-muted-foreground mt-1">
 Operator Dashboard
 </p>
 </div>

 {/* Menu */}
 <nav className="flex-1 p-6 space-y-3 relative z-10">

 <NavLink
 to="/operator/dashboard"
 className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
 ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
 : "text-muted-foreground hover:bg-muted hover:text-foreground"
 }`}
 >
 <LayoutDashboard size={20} />
 <span>Dashboard</span>
 </NavLink>

 <NavLink
 to="/operator/tasks"
 className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
 ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
 : "text-muted-foreground hover:bg-muted hover:text-foreground"
 }`}
 >
 <ClipboardList size={20} />
 <span>Issues</span>
 </NavLink>

 <NavLink
 to="/operator/history"
 className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
 ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
 : "text-muted-foreground hover:bg-muted hover:text-foreground"
 }`}
 >
 <FileText size={20} />
 <span>Issue History</span>
 </NavLink>

 <NavLink
 to="/operator/profile"
 className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
 ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
 : "text-muted-foreground hover:bg-muted hover:text-foreground"
 }`}
 >
 <User size={20} />
 <span>Profile</span>
 </NavLink>

 <NavLink
 to="/operator/notifications"
 className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium text-sm ${isActive
 ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
 : "text-muted-foreground hover:bg-muted hover:text-foreground"
 }`}
 >
 <Bell size={20} />
 <span>Notifications</span>
 </NavLink>
 </nav>

 {/* Logout */}
 <div className="p-8 border-t border-border relative z-10">
 <button
 onClick={handleLogout}
 className="flex items-center gap-4 w-full px-6 py-5 rounded-2xl transition-all duration-300 font-medium text-sm text-destructive hover:bg-destructive hover:text-white"
 >
 <LogOut size={20} />
 <span>Logout</span>
 </button>
 </div>
 </aside>

 {/* ===== MAIN CONTENT ===== */}
 <div className="flex-1 flex flex-col h-screen overflow-hidden">

 {/* Navbar */}
 <header className="h-24 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-10">
 <h2 className="text-xl font-semibold text-foreground">
 Overview
 </h2>

 <div className="flex items-center gap-8">
 <ThemeToggle />

 {/* Search */}
 <div className="relative">
 <Search
 size={18}
 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
 />
 <input
 type="text"
 placeholder="Search..."
 className="bg-muted border border-border pl-12 pr-6 py-3 rounded-2xl text-sm focus:outline-none text-foreground focus:ring-4 focus:ring-primary/10 transition-all w-64 placeholder:text-muted-foreground/50"
 />
 </div>

 {/* Profile */}
 <div className="flex items-center gap-4 pl-4 border-l border-border">
 <div className="text-right">
 <p className="text-sm font-semibold text-foreground">
 {operator?.fullName || "Operator"}
 </p>
 <p className="text-xs text-success">
 Connected
 </p>
 </div>

 {/* Avatar */}
 <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-primary-foreground text-lg">
 {operator?.fullName?.charAt(0) || "O"}
 </div>
 </div>
 </div>
 </header>

 {/* Page Content */}
 <main className="flex-1 overflow-y-auto p-12 bg-background/50">
 {children}
 </main>
 </div>
 <FAQChatbot role="operator" />
 </div>
 );
};

export default OperatorLayout;
