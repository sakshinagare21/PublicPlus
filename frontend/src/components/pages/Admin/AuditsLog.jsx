import toast from "react-hot-toast";
import { Clock, Search, Filter, Download } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const logs = [
 { timestamp: "2024-01-15 14:23:45", user: "Admin Console", action: "Escalation Override", target: "Ticket #8821", ip: "192.168.1.42", status: "Success" },
 { timestamp: "2024-01-15 14:22:30", user: "AI Engine v4.2", action: "Auto-Dispatch", target: "Ticket #9921", ip: "System", status: "Success" },
 { timestamp: "2024-01-15 14:20:12", user: "Sarah Jenkins", action: "Trust Score Update", target: "User: David M.", ip: "10.0.0.15", status: "Success" },
 { timestamp: "2024-01-15 14:18:55", user: "System", action: "Backup Completed", target: "Database v4.2", ip: "System", status: "Success" },
 { timestamp: "2024-01-15 14:15:30", user: "Unknown", action: "Login Attempt", target: "Admin Panel", ip: "192.168.1.1", status: "Failed" },
 { timestamp: "2024-01-15 14:10:00", user: "Elena Vance", action: "Rule Deployment", target: "Routing Engine", ip: "10.0.0.22", status: "Success" },
 { timestamp: "2024-01-15 14:05:22", user: "AI Engine v4.2", action: "Classification", target: "Batch #150", ip: "System", status: "Success" },
 { timestamp: "2024-01-15 14:00:00", user: "System", action: "Heartbeat Check", target: "All Modules", ip: "System", status: "Success" },
];

export default function AuditLogs() {
 return (
 <AdminLayout>
 <div className="space-y-6 text-gray-200">

 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold">Audit Logs</h1>
 <p className="text-sm text-gray-400">
 Complete system activity trail • {logs.length} entries
 </p>
 </div>

 <div className="flex items-center gap-3">

 {/* Search */}
 <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
 <Search className="w-4 h-4 text-gray-400" />
 <input
 placeholder="Search logs..."
 className="bg-transparent outline-none text-sm w-48 text-white placeholder-gray-500"
 onKeyDown={(e) => {
 if (e.key === "Enter") toast("Searching logs...");
 }}
 />
 </div>

 {/* Filter */}
 <button
 onClick={() => toast("Filters opened")}
 className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white"
 >
 <Filter className="w-4 h-4" />
 </button>

 {/* Export */}
 <button
 onClick={() => toast.success("Exporting logs...")}
 className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
 >
 <Download className="w-4 h-4" />
 Export
 </button>

 </div>
 </div>

 {/* Logs Table */}
 <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

 <table className="w-full text-sm">

 <thead>
 <tr className="text-xs text-gray-400 tracking-wider border-b border-gray-800">
 <th className="text-left p-4">TIMESTAMP</th>
 <th className="text-left p-4">USER</th>
 <th className="text-left p-4">ACTION</th>
 <th className="text-left p-4">TARGET</th>
 <th className="text-left p-4">IP ADDRESS</th>
 <th className="text-left p-4">STATUS</th>
 </tr>
 </thead>

 <tbody>
 {logs.map((log, i) => (
 <tr
 key={i}
 className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors cursor-pointer"
 onClick={() =>
 toast(
 `${log.action} by ${log.user} on ${log.target}`
 )
 }
 >
 <td className="p-4 font-mono text-xs text-gray-400 flex items-center gap-2">
 <Clock className="w-3 h-3" />
 {log.timestamp}
 </td>

 <td className="p-4">{log.user}</td>

 <td className="p-4 font-medium">{log.action}</td>

 <td className="p-4 text-gray-400">{log.target}</td>

 <td className="p-4 font-mono text-xs">{log.ip}</td>

 <td className="p-4">
 <span
 className={`text-xs px-2 py-1 rounded font-medium ${
 log.status === "Success"
 ? "bg-green-500/20 text-green-400"
 : "bg-red-500/20 text-red-400"
 }`}
 >
 {log.status}
 </span>
 </td>

 </tr>
 ))}
 </tbody>

 </table>

 </div>

 </div>
 </AdminLayout>
 );
}

