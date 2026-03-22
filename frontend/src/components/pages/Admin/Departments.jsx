import { useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Download,
  Search,
  MoreVertical,
  Pencil,
  Building2,
  Zap,
  HeartPulse,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const deptStats = [
  { label: "Total Departments", value: "24", change: "+2 New", icon: Building2, changeColor: "text-blue-400" },
  { label: "Avg. Resolution Time", value: "1h 42m", change: "-5% Time", icon: Zap, changeColor: "text-green-400" },
  { label: "Active Operators", value: "112", change: "88% Online", icon: HeartPulse, changeColor: "text-green-400" },
];

const departments = [
  { name: "Public Works", sub: "Infrastructure & Maintenance", lead: "Dr. Marcus Vance", tickets: 42, efficiency: 94, status: "ON TRACK", color: "bg-blue-600" },
  { name: "Energy & Utilities", sub: "Power Grid Management", lead: "Sarah Jenkins", tickets: 118, efficiency: 62, status: "DELAYED", color: "bg-yellow-500" },
  { name: "Public Health", sub: "Emergency & Sanitation", lead: "Leo Thompson", tickets: 29, efficiency: 88, status: "ON TRACK", color: "bg-blue-600" },
];

const teamMembers = [
  { name: "Elena Rodriguez", role: "Lead Operator • Energy Dept", solved: 14 },
  { name: "James Wilson", role: "Junior Analyst • Health Dept", solved: 8 },
  { name: "Maya Patel", role: "Dispatcher • Public Works", solved: 22 },
];

export default function Departments() {
  const [activeTab, setActiveTab] = useState("Department List");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminLayout>
    <div className="space-y-6 text-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Home › Departments</p>
          <h1 className="text-2xl font-bold">Department Management</h1>
        </div>

        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments..."
              className="bg-transparent outline-none text-sm w-40 text-white placeholder-gray-500"
            />
          </div>

          {/* Add Department */}
          <button
            onClick={() => toast("Opening department form...")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>

          {/* Export */}
          <button
            onClick={() => toast.success("Exporting department data...")}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {deptStats.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <span className={`text-xs ${stat.changeColor}`}>{stat.change}</span>
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">

        {/* Tabs */}
        <div className="flex border-b border-gray-800 px-4">
          {["Department List", "Zone Mapping", "Team Members"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 tracking-wider border-b border-gray-800">
              <th className="text-left p-4">DEPARTMENT NAME</th>
              <th className="text-left p-4">DEPARTMENT LEAD</th>
              <th className="text-left p-4">OPEN TICKETS</th>
              <th className="text-left p-4">EFFICIENCY SCORE</th>
              <th className="text-left p-4">STATUS</th>
              <th className="text-left p-4">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept.name}
                className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${dept.color}/20 flex items-center justify-center`}>
                      <Building2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{dept.name}</p>
                      <p className="text-xs text-gray-400">{dept.sub}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px]">
                    👤
                  </div>
                  {dept.lead}
                </td>

                <td className="p-4">{dept.tickets}</td>

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          dept.efficiency > 80
                            ? "bg-green-500"
                            : dept.efficiency > 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${dept.efficiency}%` }}
                      />
                    </div>
                    <span className="text-xs">{dept.efficiency}%</span>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      dept.status === "ON TRACK"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {dept.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      toast(`${dept.name} details opened`)
                    }
                    className="text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">

        {/* Map */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Zone Accountability Map</h3>
          <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            🗺️ Interactive Map View
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Performance</h3>
            <button
              onClick={() => toast("Opening team management...")}
              className="text-sm text-blue-400 hover:underline"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.solved} Solved</p>
                    <p className="text-xs text-gray-400">Today</p>
                  </div>

                  <button
                    onClick={() => toast(`Edit ${member.name}`)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <button
            onClick={() => toast("Opening invite form...")}
            className="w-full mt-4 py-2 border border-gray-800 rounded-lg text-sm text-gray-400 hover:text-white hover:border-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            👥 Invite New Member
          </button>

        </div>
      </div>

    </div>
    </AdminLayout>
  );
}
