// DepartmentDashboard.jsx
import DepartmentLayout from "../../layout/DepartmentLayout"
import {
  AlertCircle,
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Edit,
} from "lucide-react";

const DepartmentDashboard = () => {
  return (
    <DepartmentLayout>
      <div className="space-y-6">

        {/* ===== KPI CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Active Issues */}
          <div className="bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <AlertCircle className="text-blue-400" size={20} />
              </div>
              <span className="text-green-400 text-xs">+5%</span>
            </div>
            <p className="text-gray-400 text-sm">Active Issues</p>
            <h2 className="text-2xl font-bold mt-2">142</h2>
          </div>

          {/* Overdue Issues */}
          <div className="bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-red-600/20 p-3 rounded-lg">
                <Clock className="text-red-400" size={20} />
              </div>
              <span className="text-red-400 text-xs">-2%</span>
            </div>
            <p className="text-gray-400 text-sm">Overdue Issues</p>
            <h2 className="text-2xl font-bold mt-2">18</h2>
          </div>

          {/* SLA Compliance */}
          <div className="bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-600/20 p-3 rounded-lg">
                <ShieldCheck className="text-green-400" size={20} />
              </div>
              <span className="text-green-400 text-xs">+1.5%</span>
            </div>
            <p className="text-gray-400 text-sm">SLA Compliance</p>
            <h2 className="text-2xl font-bold mt-2">94.2%</h2>
          </div>

          {/* Open Zones */}
          <div className="bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <MapPin className="text-yellow-400" size={20} />
              </div>
              <span className="text-gray-400 text-xs">0%</span>
            </div>
            <p className="text-gray-400 text-sm">Open Zones</p>
            <h2 className="text-2xl font-bold mt-2">12</h2>
          </div>

        </div>

        {/* ===== MIDDLE SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Zone Heatmap */}
          <div className="lg:col-span-2 bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Zone Heatmap</h3>
              <div className="flex gap-3 text-sm">
                <button className="bg-blue-600/20 px-3 py-1 rounded-lg">
                  Live
                </button>
                <button className="text-gray-400">Historical</button>
              </div>
            </div>

            <div className="h-64 rounded-lg bg-gradient-to-br from-[#1c2a3a] to-[#0f1c2e] flex items-end p-6 relative">

              <div className="bg-[#0b1624] p-4 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">ACTIVE ZONE</p>
                <p className="font-semibold">Central District</p>
                <p className="text-red-400 text-sm mt-1">
                  ~ 14 High priority issues
                </p>
              </div>

              <div className="absolute right-6 bottom-6 flex flex-col gap-2">
                <button className="bg-[#0b1624] border border-gray-700 px-3 py-2 rounded-lg">+</button>
                <button className="bg-[#0b1624] border border-gray-700 px-3 py-2 rounded-lg">−</button>
              </div>

            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>

            <div className="space-y-6 text-sm">

              <div className="flex gap-3">
                <CheckCircle className="text-green-400" size={18} />
                <div>
                  <p className="font-medium">Issue #842 Resolved</p>
                  <p className="text-gray-400">
                    Water main leak fixed in North District.
                  </p>
                  <span className="text-gray-500 text-xs">2 mins ago</span>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertTriangle className="text-red-400" size={18} />
                <div>
                  <p className="font-medium text-red-400">
                    New High Priority Issue
                  </p>
                  <p className="text-gray-400">
                    Traffic signal outage reported.
                  </p>
                  <span className="text-gray-500 text-xs">18 mins ago</span>
                </div>
              </div>

              <div className="flex gap-3">
                <UserPlus className="text-blue-400" size={18} />
                <div>
                  <p className="font-medium">New Team Member</p>
                  <p className="text-gray-400">
                    Sarah assigned to maintenance team.
                  </p>
                  <span className="text-gray-500 text-xs">1 hour ago</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Edit className="text-gray-400" size={18} />
                <div>
                  <p className="font-medium">Schedule Updated</p>
                  <p className="text-gray-400">
                    Waste collection adjusted for holidays.
                  </p>
                  <span className="text-gray-500 text-xs">3 hours ago</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ===== ISSUE TRENDS ===== */}
        <div className="bg-[#0f1c2e] border border-gray-800 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Issue Trends</h3>
          <p className="text-gray-400 text-sm mb-4">
            Resolution rates over the last 7 days
          </p>

          <div className="h-40 bg-gradient-to-br from-[#1c2a3a] to-[#0f1c2e] rounded-lg flex items-center justify-center text-gray-500">
            Chart Placeholder
          </div>
        </div>

      </div>
    </DepartmentLayout>
  );
};

export default DepartmentDashboard;