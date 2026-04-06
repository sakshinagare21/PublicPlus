import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  FileText,
  BarChart3,
  MapPin,
  Users,
  Settings,
  Bell,
  Search,
  HelpCircle,
  Plus,
  LogOut,
} from "lucide-react";
import LanguageDropdown from "../pages/common/LanguageDropdown";
import ThemeToggle from "../common/ThemeToggle";
import FAQChatbot from "../common/FAQChatbot";
import { useAuth } from "../../context/AuthContext";
import LogoutConfirmModal from "../common/LogoutConfirmModal";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Community", path: "/community-issues" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: MapPin, label: "Map View", path: "/map" },
  // { icon: TriangleAlert, label: "Alerts", path: "/alerts" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];


const adminItems = [
  { icon: Users, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/user-settings" },
];

const DashboardLayout = ({ children }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login-citizen");
  };

  const getNavClass = (path) => {
    return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${location.pathname === path
      ? "bg-primary/20 text-primary"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`;
  };

  const getUserInitials = () => {
    const name = user?.fullName || user?.departmentName || "User";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">

        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">civic intel</span>
            <p className="text-[10px] tracking-wider text-muted-foreground">
              urban accountability
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link to="/post-report">
            <button className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90 hover:shadow-lg active:scale-95 mb-4">
              <div className="flex items-center justify-center gap-2"><Plus size={18} /> Post Report </div>
            </button>
          </Link>

          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={getNavClass(item.path)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

          <div className="pt-6 pb-2 px-3">
            <p className="text-xs font-semibold tracking-wider text-gray-600">
              Personal
            </p>
          </div>

          {adminItems.map((item) => (
            <Link key={item.path} to={item.path} className={getNavClass(item.path)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <Link
            to="/help"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition tracking-tight font-medium"
          >
            <HelpCircle className="h-4 w-4" />
            Support Center
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors font-bold tracking-[0.1em] text-[10px]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">

          <div className="flex items-center gap-4">

            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Building2 className="h-4 w-4 text-white" />
              </div>
            </div>



          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/notifications" className="relative rounded-lg p-2 hover:bg-accent transition">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Link>

            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground text-center">
                  {user?.fullName || user?.departmentName || "User Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground tracking-widest text-center">
                  {role ? `${role} Member` : "Identity Active"}
                </p>
              </div>

              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 overflow-hidden">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user?.fullName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-primary">
                    {getUserInitials()}
                  </span>
                )}
              </div>
            </div>

          </div>

        </header>

        <main className="flex-1 overflow-auto p-6 bg-background/50">
          {children}
        </main>

      </div>
      <FAQChatbot role="user" />
    </div>
  );
};

export default DashboardLayout;

