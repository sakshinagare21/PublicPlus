import { useState } from "react";
import { NavLink } from "react-router-dom";
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
  Settings,
  Shield,
  Search,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: AlertTriangle, label: "Issue Intelligence", path: "/admin-issues" },
  { icon: ClipboardList, label: "Task Operations", path: "/tasks" },
  { icon: Building2, label: "Departments", path: "/departments" },
  { icon: Bot, label: "AI Console", path: "/ai-console" },
  { icon: BarChart3, label: "Analytics", path: "/admin-analytics" },
  { icon: Map, label: "Zone Mapping", path: "/zones" },
  { icon: Bell, label: "Notifications", path: "/admin-alerts" },
  { icon: ClipboardList, label: "AI Engine", path: "/ai-engine" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Clock, label: "Audit Logs", path: "/audit" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },

];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          collapsed ? "w-16" : "w-56"
        } shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="py-4 px-2 border-t border-gray-800 space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900 shrink-0">

          {/* Left */}
          <div className="flex items-center gap-4">

            {/* Collapse Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                placeholder="Search ticket ID, zone, or department..."
                className="bg-transparent outline-none text-sm w-64 text-white placeholder-gray-500"
              />
            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-400">
                SYSTEM ACTIVE
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium">
                Admin Console
              </div>
              <div className="text-xs text-gray-400">
                SUPER ADMIN
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              SA
            </div>

          </div>
        </header>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
