import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  Globe,
  TriangleAlert,
  Plus
} from "lucide-react";
import LanguageDropdown from "../pages/common/LanguageDropdown";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: MapPin, label: "Map View", path: "/map" },
  { icon: TriangleAlert, label: "Alerts", path: "/alerts" },

];

const adminItems = [
  { icon: Users, label: "Users", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/user-settings" },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const getNavClass = (path) => {
    return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
        : "text-gray-500 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-950 lg:flex">

        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">Civic Intel</span>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Urban Accountability
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
        <Link to="/post-report">
            <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-95">
               <div className="flex"><Plus/> Post Report </div>
            </button>
        </Link>

          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={getNavClass(item.path)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

          <div className="pt-4 pb-2 px-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Admin
            </p>
          </div>

          {adminItems.map((item) => (
            <Link key={item.path} to={item.path} className={getNavClass(item.path)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

        </nav>

        <div className="border-t p-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            Support Center
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-gray-950 px-6">

          <div className="flex items-center gap-4">

            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Building2 className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search reports, locations, or IDs..."
                className="h-10 w-80 rounded-lg border bg-gray-100 dark:bg-gray-800 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          <div className="flex items-center gap-4">

            <LanguageDropdown/>

            <button className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Metropolis Hub</p>
              </div>

              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">AU</span>
              </div>

            </div>

          </div>

        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
