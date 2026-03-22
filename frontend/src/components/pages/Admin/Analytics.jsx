import { useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  TrendingDown,
  TrendingUp,
  ThumbsUp,
  CheckCircle,
  Minus,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const stats = [
  {
    label: "Total Active Issues",
    value: "1,429",
    change: "12.5% vs last month",
    trend: "down",
    icon: "📋",
    color: "text-red-400",
  },
  {
    label: "Avg. Response Time",
    value: "18.4 hrs",
    change: "4.2 hrs improved",
    trend: "up",
    icon: "⏱️",
    color: "text-green-400",
  },
  {
    label: "Resolution Rate",
    value: "92.8%",
    change: "3% increase",
    trend: "up",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    label: "Citizen Satisfaction",
    value: "4.6/5",
    change: "Stable",
    trend: "stable",
    icon: ThumbsUp,
    color: "text-gray-400",
  },
];

const mapFilters = ["Intensity", "Department", "Urgency"];

export default function Analytics() {
  const [activeFilter, setActiveFilter] = useState("Intensity");
  const [timeRange, setTimeRange] = useState("Last 30 Days");


  return (
    <AdminLayout>
    <div className="space-y-6 text-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Municipal Analytics Console
          </h1>
          <p className="text-sm text-gray-400">
            District 4 · Metro Region • Last updated: 12 minutes ago
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              toast(`Range: ${e.target.value}`);
            }}
            className="bg-gray-900 border border-gray-800 text-sm px-3 py-2 rounded-lg"
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
          </select>

          <button
            onClick={() => toast("Notifications")}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <span className="text-lg">
                {typeof stat.icon === "string" ? (
                  stat.icon
                ) : (
                  <stat.icon className="w-5 h-5 text-green-400" />
                )}
              </span>
            </div>

            <p className="text-3xl font-bold mb-1">{stat.value}</p>

            <p className={`text-xs flex items-center gap-1 ${stat.color}`}>
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3" />
              ) : stat.trend === "down" ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <h3 className="font-semibold">Issue Density Heatmap</h3>
            <p className="text-sm text-gray-400">
              Geospatial distribution of reported municipal issues
            </p>
          </div>

          <div className="flex gap-2">
            {mapFilters.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  toast(`Filter: ${f}`);
                }}
                className={`text-xs px-3 py-1.5 rounded-md ${
                  activeFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[350px] bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 text-xs text-gray-400">
          <div className="flex gap-4">
            <span>
              Active Wards: <span className="text-white">12/12</span>
            </span>
            <span>
              Top Ward:{" "}
              <span className="text-blue-400">
                Downtown Central (Ward 4)
              </span>
            </span>
          </div>

          <button
            onClick={() => toast("Full Map View")}
            className="text-blue-400 hover:underline"
          >
            View Full Map View ↗
          </button>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-2 gap-4">

        {/* Chart 1 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Resolution Trends</h3>

          <div className="h-40 flex items-end gap-2">
            {[65, 78, 55, 82, 70, 90, 85, 72, 88, 95, 80, 92].map((v, i) => (
              <div key={i} className="flex-1 bg-blue-600/40 rounded-t"
                   style={{ height: `${v}%` }} />
            ))}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold mb-4">
            Response Times by Dept.
          </h3>

          <div className="space-y-4">
            {[
              { dept: "Public Works", pct: 60 },
              { dept: "Sanitation", pct: 40 },
              { dept: "Public Safety", pct: 80 },
              { dept: "Environment", pct: 25 },
            ].map((d) => (
              <div key={d.dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{d.dept}</span>
                </div>

                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </AdminLayout>
  );
}
