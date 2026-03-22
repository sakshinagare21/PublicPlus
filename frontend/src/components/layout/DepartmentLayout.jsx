import { NavLink } from "react-router-dom";
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
} from "lucide-react";

const DepartmentLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0f172a] to-[#0b1120] text-gray-200">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0b1624] border-r border-gray-800 flex flex-col h-screen overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-blue-400">PublicPlus</h1>
          <p className="text-xs text-gray-400">DEPT ADMIN</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-6 text-sm">
          {/* MAIN */}
          <div>
            <p className="text-gray-500 text-xs mb-3">MAIN</p>

            <NavLink
              to="/department/dashboard"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/department/issues"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
            >
              <AlertTriangle size={18} />
              Issues
            </NavLink>

            <NavLink
              to="/department/taskboard"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
            >
              <ClipboardList size={18} />
              Task Board
            </NavLink>
          </div>

          {/* MANAGEMENT */}
          <div>
            <p className="text-gray-500 text-xs mb-3">MANAGEMENT</p>

            <NavLink
              to="/department/team"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
            >
              <Users size={18} />
              Team Management
            </NavLink>

            <NavLink
              to="/department/zones"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
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
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
            >
              <BarChart3 size={18} />
              Performance
            </NavLink>

            <NavLink
              to="/department/reports"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
            >
              <FileText size={18} />
              Reports
            </NavLink>
            <NavLink
              to="/department/operator-requests"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
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
                to="/department/settings"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600/20 transition"
              >
                <Settings size={18} />
                Settings
              </NavLink>

              {/* SUB ITEMS */}
              <NavLink
                to="/department/settings/issue-types"
                className="ml-8 flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-blue-400 transition"
              >
                • Issue Types
              </NavLink>

              <NavLink
                to="/department/settings/zones"
                className="ml-8 flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-blue-400 transition"
              >
                • Zone Configuration
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600"></div>
          <NavLink to="/department/profile" className="flex-1">
            <p className="text-sm font-medium">Jane Doe</p>
            <p className="text-xs text-gray-400">City Manager</p>
          </NavLink>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Department Overview</h2>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search data..."
                className="bg-[#0b1624] border border-gray-700 pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Button */}
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition">
              <Plus size={16} />
              New Report
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DepartmentLayout;
