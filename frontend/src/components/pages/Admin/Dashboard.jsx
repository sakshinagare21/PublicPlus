import { useState } from "react";
import {
AlertTriangle,
CheckCircle,
Clock,
TrendingUp,
Eye,
Settings as SettingsIcon,
ArrowUpRight,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const statsCards = [
{ label: "CRITICAL ISSUES", value: "42", change: "+12% from last hour", changeType: "critical", icon: AlertTriangle },
{ label: "PENDING TRIAGE", value: "184", change: "Stable volume", changeType: "neutral", icon: Clock },
{ label: "RESOLVED (24H)", value: "1,205", change: "94% resolution rate", changeType: "success", icon: CheckCircle },
];

const slaAlerts = [
{ id: "#8821", severity: "CRITICAL", title: "Traffic Signal Failure at Broadway & 7th Ave", time: "04:12" },
{ id: "#8792", severity: "WARNING", title: "Public Health Concern: Sewage Leak reported", time: "18:45" },
{ id: "#8910", severity: "CRITICAL", title: "Building Integrity: Zone 11 Crack Report", time: "01:30" },
{ id: "#8944", severity: "WARNING", title: "Street Light Maintenance Backlog", time: "45:00" },
];

const departments = [
{ name: "PUBLIC WORKS", load: 88, color: "bg-red-500" },
{ name: "SANITATION & WASTE", load: 64, color: "bg-blue-500" },
{ name: "PUBLIC SAFETY", load: 42, color: "bg-green-500" },
{ name: "ENVIRONMENTAL CARE", load: 21, color: "bg-green-500" },
];

const aiLogs = [
{ time: "14:22:01", tag: "SENTIMENT_ANALYSIS", msg: "Issue #9921 categorized as 'High Stress' from audio transcript." },
{ time: "14:22:04", tag: "AUTO_DISPATCH", msg: "Sector 12 Public Works assigned to ticket #9921. Confidence: 0.98." },
{ time: "14:22:15", tag: "ANOMALY_DETECTION", msg: "Detected spike in power surge reports in Zone 3." },
{ time: "14:22:30", tag: "PROCESSOR_LOAD", msg: "LLM Node 4 processing batch of reports..." },
];

const tagColors = {
SENTIMENT_ANALYSIS: "text-blue-400",
AUTO_DISPATCH: "text-yellow-400",
ANOMALY_DETECTION: "text-yellow-400",
PROCESSOR_LOAD: "text-green-400",
};

export default function Dashboard() {
const [activeFilter, setActiveFilter] = useState("INFRASTRUCTURE");
const [timeRange, setTimeRange] = useState("Last 24 Hours");

return ( 
    <AdminLayout>
<div className="space-y-6 p-6 bg-gray-950 min-h-screen text-white">

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {statsCards.map((stat) => (
      <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between">
        <div>
          <p className="text-xs text-gray-400">{stat.label}</p>
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className={`text-xs mt-2 flex gap-1 ${
            stat.changeType === "critical"
              ? "text-red-400"
              : stat.changeType === "success"
              ? "text-green-400"
              : "text-gray-400"
          }`}>
            {stat.changeType !== "neutral" && <TrendingUp className="w-3 h-3" />}
            {stat.change}
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
          <stat.icon className="w-5 h-5" />
        </div>
      </div>
    ))}
  </div>

  {/* Map + Alerts */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

    {/* Map */}
    <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

      <div className="flex justify-between p-4 border-b border-gray-800">
        <h3 className="font-semibold">Zone Mapping Overview</h3>

        <div className="flex gap-2">
          {["INFRASTRUCTURE", "SAFETY", "ENVIRONMENT"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-md ${
                activeFilter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {f}
            </button>
          ))}

          <button className="p-2 bg-gray-800 text-gray-400 rounded-md">
            <SettingsIcon className="w-4 h-4" />
          </button>

          <button className="p-2 bg-gray-800 text-gray-400 rounded-md">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-[400px] bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800" />
    </div>

    {/* Alerts */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="font-semibold mb-3">SLA Risk Alerts</h3>

      {slaAlerts.map((alert) => (
        <div key={alert.id} className="mb-4 border-b border-gray-800 pb-3">
          <p className="text-sm font-medium">{alert.title}</p>
          <p className="text-xs text-gray-400 mb-2">
            {alert.severity} • {alert.time}
          </p>
          <button className="text-xs bg-blue-600 px-3 py-1 rounded">
            Escalate
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Bottom */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

    {/* Departments */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold mb-4">Department Load</h3>

      {departments.map((dept) => (
        <div key={dept.name} className="mb-4">
          <div className="flex justify-between text-sm">
            <span>{dept.name}</span>
            <span>{dept.load}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded">
            <div className={`${dept.color} h-full rounded`} style={{ width: `${dept.load}%` }} />
          </div>
        </div>
      ))}
    </div>

    {/* Logs */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 font-mono text-xs">
      <h3 className="font-semibold mb-3">AI Engine Logs</h3>

      {aiLogs.map((log, i) => (
        <div key={i}>
          [{log.time}]{" "}
          <span className={tagColors[log.tag] || "text-gray-400"}>
            {log.tag}:
          </span>{" "}
          {log.msg}
        </div>
      ))}
    </div>
  </div>
</div>
</AdminLayout>

);
}
