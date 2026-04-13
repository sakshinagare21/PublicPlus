import { NavLink, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import LogoutConfirmModal from "../common/LogoutConfirmModal";
import FAQChatbot from "../common/FAQChatbot";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
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
  Plus,
  LogOut
} from "lucide-react";

const DepartmentLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [deptInfo, setDeptInfo] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/decide-role");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [deptRes, countRes] = await Promise.all([
           axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setDeptInfo(deptRes.data);
        setUnreadCount(countRes.data.count);
      } catch (err) {
        console.error("Layout fetch error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
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
              className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-600/20 transition group"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} />
                Notifications
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-red-500/20 animate-bounce">
                  {unreadCount}
                </span>
              )}
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
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
            {deptInfo?.departmentName?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <Link to={deptInfo ? "/department/profile" : "#"} className="block group">
              <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors uppercase   tracking-tighter">
                {deptInfo?.departmentName || "Authorization Pending"}
              </p>
              <p className="text-[9px] font-bold text-muted-foreground tracking-widest opacity-50">
                {deptInfo?.departmentCode || "DEPT_SECURE_LINK"}
              </p>
            </Link>
          </div>
        </div>
        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-3 py-3 bg-destructive/5 text-destructive rounded-xl border border-destructive/10 font-black tracking-widest text-[10px] hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-foreground">Department Overview</h2>

          <div className="flex items-center gap-4">
            <ThemeToggle />

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


