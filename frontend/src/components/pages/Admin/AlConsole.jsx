import { useState } from "react";
import toast from "react-hot-toast";
import { Search, History, Share2 } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const cases = [
  { id: "CASE-8821", status: "FAILED", title: 'Citizen flagged: "Pothole filled with loose gravel only."', time: "14m ago", location: "Sector 7G", priority: true },
  { id: "CASE-9012", status: "IN REVIEW", title: "Graffiti Removal - External Wall - Public Library", time: "2h ago", location: "Downtown", priority: false },
  { id: "CASE-9015", status: "NEW", title: "Structural Damage - Bridge Abutment", time: "4h ago", location: "Westside", priority: false },
];

const statusColors = {
  FAILED: "bg-red-500 text-white",
  "IN REVIEW": "bg-yellow-500/20 text-yellow-400",
  NEW: "bg-blue-500/20 text-blue-400",
};

export default function AIConsole() {
  const [selectedCase, setSelectedCase] = useState(cases[1]);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminLayout>
    <div className="flex gap-4 h-[calc(100vh-8rem)]">

      {/* ================= LEFT PANEL ================= */}
      <div className="w-72 shrink-0 space-y-4">

        <div className="flex items-center justify-between">
          <h3 className="text-xs tracking-widest text-gray-400">
            VERIFICATION QUEUE
          </h3>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
            24 Pending
          </span>
        </div>

        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case ID..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder-gray-500"
          />
        </div>

        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition ${
                selectedCase.id === c.id
                  ? "border-blue-500"
                  : "border-gray-700 hover:border-blue-500/50"
              }`}
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-blue-400">
                  {c.id}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusColors[c.status]}`}
                >
                  {c.status}
                </span>
              </div>

              <p className="text-sm mb-2 text-gray-200">{c.title}</p>

              <div className="flex gap-3 text-xs text-gray-400">
                <span>🕐 {c.time}</span>
                <span>📍 {c.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CENTER PANEL ================= */}
      <div className="flex-1 space-y-4 overflow-y-auto">

        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-white">
              {selectedCase.id} Verification
            </h1>

            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
              MEDIUM CONFIDENCE (74%)
            </span>
          </div>

          <p className="text-sm text-gray-400">
            📍 1224 Library Lane • AI Surveillance Cam #40
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => toast("Loading case history...")}
            className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-sm hover:border-blue-500"
          >
            <History className="w-4 h-4" />
            History
          </button>

          <button
            onClick={() => toast.success("Link copied!")}
            className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-sm hover:border-blue-500"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>

        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex gap-4 bg-gray-900 border border-gray-700 rounded-xl p-4">

          <button
            onClick={() => toast.success("Case Verified")}
            className="px-4 py-2 border border-gray-700 rounded hover:border-blue-500"
          >
            Verify
          </button>

          <button
            onClick={() => toast.error("Case Rejected")}
            className="px-4 py-2 border border-gray-700 rounded hover:border-red-500"
          >
            Reject
          </button>

          <button
            onClick={() => toast("Escalated to human reviewer")}
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Escalate
          </button>

        </div>

      </div>
    </div>
    </AdminLayout>
  );
}
