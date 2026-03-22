import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Filter, Rocket } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const slaSettings = [
  {
    label: "EMERGENCY",
    time: "2.5h",
    color: "text-red-400",
    desc: "Immediate threat to life or property. Requires instant triage.",
    value: 25,
  },
  {
    label: "STANDARD",
    time: "18h",
    color: "text-gray-300",
    desc: "Infrastructure repair and non-critical civic services.",
    value: 50,
  },
  {
    label: "INQUIRY",
    time: "48h",
    color: "text-gray-400",
    desc: "General information requests and documentation processing.",
    value: 75,
  },
];

const engineLogs = [
  { time: "14:22:01", tag: "INF", msg: "Incoming packet ID#8841 detected.", tagColor: "text-blue-400" },
  { time: "14:22:02", tag: "ANL", msg: "NLP classification complete. Confidence: 0.98.", tagColor: "text-yellow-400" },
  { time: "14:22:02", tag: "TRG", msg: "Match routing rule #14 - Public Works.", tagColor: "text-green-400" },
  { time: "14:22:03", tag: "EXE", msg: "Ticket created successfully. SLA set to 2.5h.", tagColor: "text-blue-400" },
  { time: "14:23:45", tag: "INF", msg: "Heartbeat check v2.4.1. All modules healthy.", tagColor: "text-blue-400" },
  { time: "14:24:12", tag: "INF", msg: "Incoming packet ID#8842 detected...", tagColor: "text-blue-400" },
  { time: "14:24:13", tag: "ANL", msg: "Processing semantic nodes...", tagColor: "text-yellow-400" },
];

const thresholds = [
  { condition: "Unassigned Backlog", trigger: "> 50 tickets / 1h", action: "Load Balance", notify: "Shift Lead", status: "Active" },
  { condition: "Stale Standard Tkt", trigger: "> 24h idle", action: "Priority Bump", notify: "Dept. Head", status: "Paused" },
];

export default function AIEngine() {
  const [draftMode, setDraftMode] = useState(false);
  const [slaValues, setSlaValues] = useState(slaSettings.map((s) => s.value));

  return (
    <AdminLayout>
    <div className="space-y-6 text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-400">System ›</p>
          <h1 className="text-xl font-bold">Automation & Intelligence Engine</h1>
          <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded font-medium">
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5 text-sm">
            <span>Draft Mode</span>
            <button
              onClick={() => {
                setDraftMode(!draftMode);
                toast(`Draft Mode ${!draftMode ? "ON" : "OFF"}`);
              }}
              className={`w-10 h-5 rounded-full relative transition-colors ${
                draftMode ? "bg-blue-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  draftMode ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs">
              👤
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Arch. Elena Vance</p>
              <p className="text-xs text-gray-400">
                Senior Systems Architect
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Section */}
        <div className="col-span-2 space-y-4">
          {/* SLA Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs tracking-widest text-gray-400">
                ℹ️ SLA AUTOMATION SETTINGS
              </h3>
              <button
                onClick={() => {
                  setSlaValues(slaSettings.map((s) => s.value));
                  toast("Reset to Default");
                }}
                className="text-sm text-blue-400 hover:underline"
              >
                Reset to Default
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {slaSettings.map((sla, i) => (
                <div key={sla.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold tracking-wider ${sla.color}`}
                    >
                      {sla.label}
                    </span>
                    <span className="text-2xl font-bold">{sla.time}</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={slaValues[i]}
                    onChange={(e) => {
                      const newValues = [...slaValues];
                      newValues[i] = Number(e.target.value);
                      setSlaValues(newValues);
                    }}
                    className="w-full h-1 bg-gray-700 rounded-full cursor-pointer accent-blue-500"
                  />

                  <p className="text-xs text-gray-400 mt-2">{sla.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Routing Rules */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs tracking-widest text-gray-400">
                ⚙️ ROUTING RULES ENGINE
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toast("Add Rule")}
                  className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toast("Filter Rules")}
                  className="p-1.5 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto py-4">
              <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 min-w-[140px]">
                <p className="text-xs text-blue-400 font-bold">TRIGGER</p>
                <p className="text-sm font-semibold mt-1">
                  Incoming Report
                </p>
              </div>

              <span className="text-gray-500">——</span>

              <div className="space-y-3">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 min-w-[200px]">
                  <p className="text-sm font-semibold">
                    Assign to Public Works
                  </p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 min-w-[200px]">
                  <p className="text-sm font-semibold">
                    Route to Incident Cmd.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Threshold Matrix */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-xs tracking-widest text-gray-400 mb-4">
              🔺 ESCALATION THRESHOLD MATRIX
            </h3>

            <table className="w-full text-sm">
              <tbody>
                {thresholds.map((t, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-3">{t.condition}</td>
                    <td className="py-3 font-mono text-xs">{t.trigger}</td>
                    <td className="py-3">{t.action}</td>
                    <td className="py-3">{t.notify}</td>
                    <td className="py-3">
                      <span
                        className={
                          t.status === "Active"
                            ? "text-green-400"
                            : "text-gray-500"
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-xs tracking-widest text-gray-400 mb-3">
            📋 LIVE ENGINE LOG
          </h3>

          <div className="font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto">
            {engineLogs.map((log, i) => (
              <div key={i}>
                <span className="text-gray-500">[{log.time}]</span>{" "}
                <span className={log.tagColor}>{log.tag}:</span>{" "}
                {log.msg}
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-800 divide-x divide-gray-800 mt-3">
            <button
              onClick={() => toast("Exported")}
              className="flex-1 py-2.5 text-xs hover:text-white"
            >
              EXPORT LOGS
            </button>
            <button
              onClick={() => toast("Cleared")}
              className="flex-1 py-2.5 text-xs hover:text-white"
            >
              CLEAR STREAM
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-6 py-3">
        <span className="text-sm text-gray-400">
          4 Editors active in this session
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast("Draft Discarded")}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Discard Draft
          </button>

          <button
            onClick={() =>
              toast.success("Changes deployed to production successfully")
            }
            className="flex items-center gap-2 bg-red-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <Rocket className="w-4 h-4" />
            Deploy to Production
          </button>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}
