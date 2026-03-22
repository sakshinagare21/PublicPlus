import OperatorLayout from "../../layout/OperatorLayout";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  MapPin,
  MoreVertical,
} from "lucide-react";

const OperatorDashboard = () => {
  return (
    <OperatorLayout>
      <div className="space-y-8">

        {/* ===== HEADER ===== */}
        <div>
          <h1 className="text-2xl font-bold">
            Operator Service Dashboard Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time field service management for municipal operations.
          </p>
        </div>

        {/* ===== KPI CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Total */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-xs uppercase">
              Total Tasks
            </p>
            <div className="flex items-center gap-2 mt-3">
              <h2 className="text-3xl font-bold">42</h2>
              <span className="text-green-400 text-sm">+5%</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-xs uppercase">
              Pending
            </p>
            <div className="flex items-center gap-2 mt-3">
              <h2 className="text-3xl font-bold">12</h2>
              <span className="text-gray-400 text-sm">Stable</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-xs uppercase">
              In Progress
            </p>
            <div className="flex items-center gap-2 mt-3">
              <h2 className="text-3xl font-bold">8</h2>
              <span className="text-green-400 text-sm">+10%</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-xs uppercase">
              Completed
            </p>
            <div className="flex items-center gap-2 mt-3">
              <h2 className="text-3xl font-bold">18</h2>
              <span className="text-green-400 text-sm">+15%</span>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-[#1b1b2e] border border-red-700 rounded-xl p-6">
            <p className="text-red-400 text-xs uppercase">
              Overdue
            </p>
            <div className="flex items-center gap-2 mt-3">
              <h2 className="text-3xl font-bold text-red-500">4</h2>
              <span className="text-red-400 text-sm">+25%</span>
            </div>
          </div>

        </div>

        {/* ===== PRIORITY TASKS ===== */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Priority Tasks (Nearing SLA Deadline)
            </h2>
            <button className="text-blue-400 text-sm hover:underline">
              View All Tasks
            </button>
          </div>

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl overflow-hidden">

            <table className="w-full text-sm">
              <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs">
                <tr>
                  <th className="text-left p-4">Task Name</th>
                  <th className="text-left p-4">Priority</th>
                  <th className="text-left p-4">Due In</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {/* Row 1 */}
                <tr className="border-t border-gray-800">
                  <td className="p-4">
                    <p className="font-medium">
                      Water Main Repair - Sector 4
                    </p>
                    <p className="text-gray-400 text-xs">
                      Infrastructure / Emergency
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs">
                      High
                    </span>
                  </td>
                  <td className="p-4 text-red-400 flex items-center gap-1">
                    <Clock size={14} />
                    2h 15m
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                      In Progress
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <MoreVertical size={16} />
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-t border-gray-800">
                  <td className="p-4">
                    Street Light Maintenance
                  </td>
                  <td className="p-4">
                    <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-full text-xs">
                      Medium
                    </span>
                  </td>
                  <td className="p-4">4h 45m</td>
                  <td className="p-4">
                    <span className="bg-gray-600/20 text-gray-300 px-3 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <MoreVertical size={16} />
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-t border-gray-800">
                  <td className="p-4">
                    Pothole Patching - Main St
                  </td>
                  <td className="p-4">
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs">
                      High
                    </span>
                  </td>
                  <td className="p-4">5h 10m</td>
                  <td className="p-4">
                    <span className="bg-gray-600/20 text-gray-300 px-3 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <MoreVertical size={16} />
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Active Service Areas */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">
              Active Service Areas
            </h3>

            <div className="h-56 bg-gradient-to-br from-[#1c2a3a] to-[#0f172a] rounded-lg flex items-center justify-center">
              <button className="bg-blue-600 px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                <MapPin size={16} />
                Live Map View
              </button>
            </div>
          </div>

          {/* Task Efficiency */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">
              Task Efficiency
            </h3>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">
                Today's Target
              </span>
              <span>18/25 Tasks</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full w-[72%]"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-600/20 p-3 rounded-lg">
                <CheckCircle className="text-green-400" size={18} />
              </div>
              <div>
                <p className="font-medium">
                  Completion Rate
                </p>
                <p className="text-gray-400 text-sm">
                  84% of tasks completed within SLA today
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </OperatorLayout>
  );
};

export default OperatorDashboard;