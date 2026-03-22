import { useState } from "react";
import toast from "react-hot-toast";
import { Filter, Search, Send } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const alerts = [
  { severity: "CRITICAL", severityColor: "text-red-400", title: "Anomalous budget spike detected in District 4", detail: "Infrastructure repair costs +420% above mean", category: "FINANCE", time: "2m ago", action: "REVIEW" },
  { severity: "WARNING", severityColor: "text-yellow-400", title: "Service Outage: Central Metro Line", detail: "Signal failure at Station 12 reported by 50+ users", category: "TRANSIT", time: "14m ago", action: "VIEW" },
  { severity: "INFO", severityColor: "text-blue-400", title: "Weekly Performance Report Generated", detail: "AI summary available for Q2 infrastructure", category: "REPORT", time: "1h ago", action: "OPEN" },
  { severity: "CRITICAL", severityColor: "text-red-400", title: "Unauthorized Database Access Attempt", detail: "Origin IP: 192.168.1.1 (External Tunnel)", category: "SECURITY", time: "3h ago", action: "RESOLVE" },
];

const feedback = [
  { name: "Elena R.", district: "District 7", text: "\"The street lights on 5th Ave have been flickering for three nights. It feels unsafe for pedestrians.\"", sentiment: "Negative", actions: ["REPLY", "FLAG"] },
  { name: "Marcus T.", district: "District 2", text: "\"Great job on the new park renovation! The community really loves the green space.\"", sentiment: "Positive", actions: ["THANK"] },
];

const escalationHistory = [
  { title: "Report #402 Escalated", detail: "Moved from AI-Review to Human-Admin", extra: "AI flagged complex legal terminology in citizen complaint.", time: "12:45 PM Today", color: "text-blue-400" },
  { title: "Ticket #388 Resolved", detail: "District 4 Power Outage", extra: null, time: "09:12 AM Today", color: "text-gray-400" },
  { title: "Priority Bump", detail: "Report #372: Water Quality", extra: null, time: "Yesterday", color: "text-yellow-400" },
];

export default function AlertsCenter() {
  const [message, setMessage] = useState("");

  return (
    <AdminLayout>
    <div className="space-y-6 text-gray-200">

      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Alert Log</h1>

        <span className="text-xs bg-red-900 text-red-400 px-2 py-1 rounded font-medium">
          4 ACTION REQUIRED
        </span>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => toast("Filters opened")}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:text-white"
          >
            <Filter className="w-4 h-4" />
          </button>

          <button
            onClick={() => toast("Search")}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">

        {/* Left Panel */}
        <div className="w-72 shrink-0 space-y-4">

          {/* System Health */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs tracking-widest text-gray-400">SYSTEM HEALTH</h3>

            <div className="flex justify-between text-sm">
              <span>AI Model Accuracy</span>
              <span className="text-green-400 font-medium">98.4%</span>
            </div>

            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[98.4%]" />
            </div>

            <p className="text-xs text-gray-400">🕐 Last backup: 14 mins ago</p>
          </div>

          {/* Escalation History */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs tracking-widest text-gray-400">⚡ ESCALATION HISTORY</h3>

            {escalationHistory.map((item, i) => (
              <div key={i} className="space-y-1">
                <span className={`text-sm font-medium ${item.color}`}>
                  {item.title}
                </span>

                <p className="text-xs text-gray-400">{item.detail}</p>

                {item.extra && (
                  <div className="bg-gray-800 rounded-lg p-2 text-xs text-gray-400">
                    {item.extra}
                  </div>
                )}

                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            ))}

            <button
              onClick={() => toast("Opening escalation archive")}
              className="w-full py-2 border border-gray-800 rounded-lg text-sm hover:text-white"
            >
              View Full Archive
            </button>
          </div>
        </div>

        {/* Center Table */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl">
          <table className="w-full text-sm">
            <tbody>
              {alerts.map((alert, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-4 font-semibold">{alert.title}</td>
                  <td className="p-4 text-gray-400">{alert.time}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toast(`${alert.action} executed`)}
                      className="px-3 py-1 bg-blue-600 rounded text-xs"
                    >
                      {alert.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Feedback */}
        <div className="w-72 shrink-0 space-y-4">

          {feedback.map((fb, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-medium">{fb.name}</p>
              <p className="text-xs text-gray-400">{fb.text}</p>

              <div className="flex gap-2 mt-2">
                {fb.actions.map(a => (
                  <button
                    key={a}
                    onClick={() => toast(`${a} sent`)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Message Box */}
          <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Message hub..."
              className="bg-transparent outline-none flex-1 text-sm"
            />

            <button
              onClick={() => {
                if (message) {
                  toast.success("Message sent");
                  setMessage("");
                }
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-3">
        <p className="text-gray-400 text-sm">
          1,284 active tickets • 92% resolution rate
        </p>
      </div>
    </div>
    </AdminLayout>
  );
}
