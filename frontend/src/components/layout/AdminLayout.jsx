import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import LogoutConfirmModal from "../common/LogoutConfirmModal";
import {
  LayoutDashboard,
  AlertTriangle,
  ClipboardList,
  Building2,
  Bot,
  BarChart3,
  Map,
  Bell,
  Users,
  Clock,
  Mail,
  Settings,
  Shield,
  Search,
  ChevronLeft,
  UserCircle,
  LogOut
} from "lucide-react";
import { useEffect } from "react";
import FAQChatbot from "../common/FAQChatbot";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: AlertTriangle, label: "Issue Intelligence", path: "/admin-issues" },
  { icon: ClipboardList, label: "Task Operations", path: "/tasks" },
  { icon: Building2, label: "Departments", path: "/departments" },
  { icon: BarChart3, label: "Analytics", path: "/admin-analytics" },
  { icon: Map, label: "Zone Mapping", path: "/zones" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Mail, label: "Contact Messages", path: "/admin/contact" },

];

const bottomItems = [
  { icon: UserCircle, label: "Admin Profile", path: "/admin/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [adminRes, countRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        const adminData = await adminRes.json();
        const countData = await countRes.json();
        
        if (adminRes.ok) setAdmin(adminData);
        setUnreadCount(countData.count || 0);
      } catch (err) {
        console.error("Failed to fetch layout data:", err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/decide-role");
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`flex flex-col bg-card border-r border-border transition-all duration-300 ${collapsed ? "w-16" : "w-56"
          } shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>

          {!collapsed && (
            <span className="font-bold tracking-tight">
              CIVIC-OS
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.label === "Notifications" && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="py-4 px-2 border-t border-border space-y-1 mt-auto">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors mt-4"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shrink-0">

          {/* Left */}
          <div className="flex items-center gap-4">

            {/* Collapse Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""
                  }`}
              />
            </button>

          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                SYSTEM ACTIVE
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm font-bold text-foreground">
                {admin?.fullName || "Admin Console"}
              </div>
              <div className="text-xs text-muted-foreground font-medium tracking-widest opacity-60">
                Root Administrator
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-glow shadow-primary/20 border border-primary/20 overflow-hidden">
              {admin?.profilePhoto ? (
                <img src={admin.profilePhoto} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                admin?.fullName?.charAt(0) || "A"
              )}
            </div>

          </div>
        </header>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
      <FAQChatbot role="admin" />
    </div>
  );
}


