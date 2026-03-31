import { NavLink } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import FAQChatbot from "../common/FAQChatbot";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
 LayoutDashboard,
 AlertTriangle,
 ClipboardList,
 Users,
 Map,
 BarChart3,
 FileText,
 Bell,
 Settings,
 Search,
 Plus
} from "lucide-react";

const DepartmentLayout = ({ children }) => {
 const [deptInfo, setDeptInfo] = useState(null);

 useEffect(() => {
 const fetchDept = async () => {
 try {
 const token = localStorage.getItem("token");
 const res = await axios.get("http://localhost:5000/api/departments/me", {
 headers: { Authorization: `Bearer ${token}` }
 });
 setDeptInfo(res.data);
 } catch (err) {
 console.error("Layout fetch error:", err);
 }
 };
 fetchDept();
 }, []);

 return (
 <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
 {/* SIDEBAR */}
 <aside className="w-64 bg-card border-r border-border flex flex-col h-screen overflow-y-auto">
 {/* Logo */}
 <div className="p-6 border-b border-border">
 <h1 className="text-xl font-semibold text-primary">PublicPlus</h1>
 <p className="text-xs text-muted-foreground">DEPT ADMIN</p>
 </div>

 {/* Menu */}
 <nav className="flex-1 p-4 space-y-6 text-sm">
 {/* MAIN */}
 <div>
 <p className="text-gray-500 text-xs mb-3">MAIN</p>

 <NavLink
 to="/department/dashboard"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <LayoutDashboard size={18} />
 Dashboard
 </NavLink>

 <NavLink
 to="/department/issues"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <AlertTriangle size={18} />
 Issues
 </NavLink>
 </div>

 {/* MANAGEMENT */}
 <div>
 <p className="text-gray-500 text-xs mb-3">MANAGEMENT</p>

 <NavLink
 to="/department/team"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <Users size={18} />
 Team Management
 </NavLink>

 <NavLink
 to="/department/zones"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <Map size={18} />
 Zones
 </NavLink>
 </div>

 {/* ANALYTICS */}
 <div>
 <p className="text-gray-500 text-xs mb-3">ANALYTICS</p>

 <NavLink
 to="/department/performance"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <BarChart3 size={18} />
 Performance
 </NavLink>

 <NavLink
 to="/department/reports"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <FileText size={18} />
 Reports
 </NavLink>
 <NavLink
 to="/department/operator-requests"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <Settings size={18} />
 Operator Requests
 </NavLink>
 </div>
 {/* SYSTEM */}
 <div>
 <p className="text-gray-500 text-xs mb-3">SYSTEM</p>

 <NavLink
 to="/department/notifications"
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
 >
 <Bell size={18} />
 Notifications
 </NavLink>

 {/* SETTINGS */}
 <div className="space-y-1">
 <NavLink
 className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/20 transition"
 >
 <Settings size={18} />
 Settings
 </NavLink>

 {/* SUB ITEMS */}
 <NavLink
 to="/department/settings/issue-types"
 className="ml-8 flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-primary transition"
 >
 • Issue Types
 </NavLink>

 <NavLink
 to="/department/settings/zones"
 className="ml-8 flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-primary transition"
 >
 • Zone Configuration
 </NavLink>
 </div>
 </div>
 </nav>

 {/* Profile Footer */}
 <div className="p-4 border-t border-border flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
 {deptInfo ? deptInfo.departmentName?.[0] : "?"}
 </div>
 <NavLink to="/department/profile" className="flex-1">
 <p className="text-sm font-medium text-foreground">
 {deptInfo ? deptInfo.departmentName : "Loading..."}
 </p>
 <p className="text-xs text-muted-foreground">
 {deptInfo ? deptInfo.departmentCode : "DEPT_ADMIN"}
 </p>
 </NavLink>
 </div>
 </aside>

 {/* MAIN CONTENT */}
 <div className="flex-1 flex flex-col">
 {/* NAVBAR */}
 <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
 <h2 className="text-lg font-semibold text-foreground">Department Overview</h2>

 <div className="flex items-center gap-4">
 <ThemeToggle />
 {/* Search */}
 <div className="relative">
 <Search
 size={16}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
 />
 <input
 type="text"
 placeholder="Search data..."
 className="bg-muted/50 border border-border pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none text-foreground"
 />
 </div>

 {/* Button */}
 <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm transition text-primary-foreground">
 <Plus size={16} />
 New Report
 </button>
 </div>
 </header>

 {/* Page Content */}
 <main className="flex-1 overflow-y-auto p-6">{children}</main>
 </div>
 <FAQChatbot role="department" />
 </div>
 );
};

export default DepartmentLayout;

