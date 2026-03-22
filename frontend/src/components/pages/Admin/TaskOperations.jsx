import { useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  MoreHorizontal,
  Eye,
  MessageSquare,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const tasks = {
  active: [
    {
      id: "TSK-8821",
      title: "Street Light Outage - Sector 7 Community Center",
      team: "Alpha Team",
      assignee: "Sarah J.",
      priority: "MEDIUM",
      time: "14:02",
    },
    {
      id: "TSK-8940",
      title: "Traffic Signal Malfunction - 4th & Main Crossing",
      team: "Bravo Team",
      assignee: "Mike R.",
      priority: "HIGH",
      time: "02:45",
      escalation: true,
    },
  ],
  overdue: [
    {
      id: "TSK-8711",
      title: "Emergency Pothole Repair - Highland Ave Highway",
      team: "Delta Unit",
      assignee: "Anita D.",
      priority: "CRITICAL",
      time: "LATE 12H",
      progress: 100,
    },
  ],
  escalated: [
    {
      id: "TSK-8802",
      title: "Waste Disposal Breach - Industrial Zone B",
      team: "Echo Team",
      assignee: "Tom L.",
      priority: "HIGH",
      time: "Director",
    },
  ],
};

const auditLog = [
  {
    event: "Task Dispatched",
    time: "10:42 AM",
    detail: "Automated AI Dispatcher",
    color: "bg-green-500",
  },
  {
    event: "Field Agent Arrived",
    time: "10:55 AM",
    detail: "GPS Verification: Mike Ross",
    color: "bg-blue-500",
  },
  {
    event: "Resource Alert",
    time: "11:10 AM",
    detail: "Unit requested additional parts",
    color: "bg-yellow-500",
  },
  {
    event: "Supervisor Notified",
    time: "11:15 AM",
    detail: "Tier I Escalation Protocol",
    color: "bg-gray-500",
  },
];

const priorityColors = {
  LOW: "text-green-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-red-400",
  CRITICAL: "text-red-500",
};

export default function TaskOperations() {
  const [view, setView] = useState("pipeline");
  const [showAudit, setShowAudit] = useState(true);

  return (
      <AdminLayout>
    <div className="space-y-6 text-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Task Operations Center</h1>
          <p className="text-sm text-gray-400">
            Real-time civic accountability pipeline
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-gray-400 tracking-wider">
              TOTAL ACTIVE
            </p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              1,284
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-gray-400 tracking-wider">
              AVG RESPONSE
            </p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              42m
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("pipeline")}
          className={`px-4 py-2 rounded-lg text-sm ${
            view === "pipeline"
              ? "bg-blue-600 text-white"
              : "bg-gray-900 border border-gray-800 text-gray-400"
          }`}
        >
          🔲 Pipeline View
        </button>

        <button
          onClick={() => setView("workload")}
          className={`px-4 py-2 rounded-lg text-sm ${
            view === "workload"
              ? "bg-blue-600 text-white"
              : "bg-gray-900 border border-gray-800 text-gray-400"
          }`}
        >
          📊 Workload Balancing
        </button>
      </div>

      <div className="flex gap-4">

        {/* Pipeline Columns */}
        <div className="flex-1 grid grid-cols-3 gap-4">

          {/* Active */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="font-semibold text-sm">Active</span>
              <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-green-400">
                48
              </span>
              <button className="ml-auto text-gray-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.active.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-blue-500/50 cursor-pointer"
                  onClick={() => {
                    setShowAudit(true);
                    toast.success(`Task Selected: ${task.id}`);
                  }}
                >
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>ID: {task.id}</span>
                    <span className="bg-gray-800 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.time}
                    </span>
                  </div>

                  <p className="text-sm font-semibold mb-3">{task.title}</p>

                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold ${
                        priorityColors[task.priority]
                      }`}
                    >
                      Priority: {task.priority}
                    </span>

                    <div className="flex gap-2">
                      <Eye
                        className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("Viewing task");
                        }}
                      />
                      <MessageSquare
                        className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast("Comment added");
                        }}
                      />
                    </div>
                  </div>

                  {task.escalation && (
                    <div className="mt-2 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                      🔗 ESCALATION CHAIN ACTIVE
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Overdue */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-semibold text-sm">Overdue</span>
              <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-red-400">
                12
              </span>
            </div>

            {tasks.overdue.map((task) => (
              <div
                key={task.id}
                className="bg-gray-900 border border-red-500/30 rounded-xl p-4 cursor-pointer"
                onClick={() => toast.error(`Overdue Task: ${task.id}`)}
              >
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">ID: {task.id}</span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {task.time}
                  </span>
                </div>

                <p className="text-sm font-semibold mb-3">{task.title}</p>

                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-full" />
                </div>

                <p className="text-xs text-right text-green-400 mt-1">
                  100%
                </p>
              </div>
            ))}
          </div>

          {/* Escalated */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="font-semibold text-sm">Escalated</span>
              <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-yellow-400">
                08
              </span>
            </div>

            {tasks.escalated.map((task) => (
              <div
                key={task.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer"
                onClick={() => toast(`Escalated Task: ${task.id}`)}
              >
                <p className="text-sm font-semibold">{task.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Panel */}
        {showAudit && (
          <div className="w-72 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">Audit Details</h3>
              <X
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowAudit(false)}
              />
            </div>

            {auditLog.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 ${log.color}`}
                />
                <div>
                  <p className="text-sm font-medium">{log.event}</p>
                  <p className="text-xs text-gray-400">
                    {log.time} · {log.detail}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                toast.error("Task escalated to emergency protocol")
              }
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              ✦ Force Escalation
            </button>
          </div>
        )}
      </div>
    </div>
  </AdminLayout>
  );
}
