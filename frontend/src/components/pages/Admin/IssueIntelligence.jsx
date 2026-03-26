
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Plus, X, MapPin } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const severityColors = {
  CRITICAL: "bg-red-500/20 text-red-400",
  HIGH: "bg-orange-500/20 text-orange-400",
  MEDIUM: "bg-yellow-500/20 text-yellow-400",
  LOW: "bg-green-500/20 text-green-400",
};

export default function IssueIntelligence() {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  /* 🔥 NEW STATE FOR STATS */
  const [stats, setStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    pending: 0,
    resolved: 0,
  });

  /*active table */
  const tabs = [
  { label: "All Issues", key: "all", count: total },
  { label: "Pending", key: "pending", count: stats.pending },
  { label: "Critical", key: "critical", count: stats.critical },
  { label: "Resolved", key: "resolved", count: stats.resolved },
];

const filteredIssues = issues.filter((issue) => {

  if (activeTab === "critical")
    return issue.priority?.level === "critical";

  if (activeTab === "pending")
    return issue.status === "reported";

  if (activeTab === "resolved")
    return issue.status === "resolved";

  return true;
});
  const token = localStorage.getItem("token");
  /* ================= CALCULATE STATS ================= */
  const calculateStats = (issues) => {
    let stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      pending: 0,
      resolved: 0,
    };

    issues.forEach((issue) => {
      const level = issue.priority?.level;

      if (level === "critical") stats.critical++;
      else if (level === "high") stats.high++;
      else if (level === "medium") stats.medium++;
      else stats.low++;

      if (issue.status === "reported") stats.pending++;
      if (issue.status === "resolved") stats.resolved++;
    });

    setStats(stats);
  };

  /* ================= FETCH ================= */
  const fetchIssues = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/issues/admin/all?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setIssues(data.issues || []);
        setTotal(data.total || 0);

        calculateStats(data.issues || []);

        if (data.issues?.length > 0) {
          setSelectedIssue(data.issues[0]);
        } else {
          setSelectedIssue(null);
        }
      }

    } catch {
      toast.error("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchIssues();
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <AdminLayout>
      <div className="space-y-4 text-gray-200">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Issue Management</h1>

            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-md">
              {total} Total Cases
            </span>

            <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-md">
              Live Data
            </span>
          </div>

          <button
            onClick={() => toast("Opening report form...")}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Manual Report
          </button>
        </div>

        {/* 🔥 STATS ROW (ADDED ONLY THIS) */}
        <div className="flex gap-3 flex-wrap">

          <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded-md">
            {stats.critical} Critical
          </span>

          <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-1 rounded-md">
            {stats.high} High
          </span>

          <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-md">
            {stats.medium} Medium
          </span>

          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-md">
            {stats.low} Low
          </span>

          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-md">
            {stats.pending} Pending
          </span>

          <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded-md">
            {stats.resolved} Resolved
          </span>

        </div>

      {/* 🔥 TABS */}
<div className="flex items-center gap-6 border-b border-gray-800">

  {tabs.map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key)}
      className={`pb-3 text-sm flex items-center gap-2 border-b-2 transition-colors ${
        activeTab === tab.key
          ? "border-blue-500 text-blue-400"
          : "border-transparent text-gray-400 hover:text-white"
      }`}
    >
      {tab.label}

      <span
        className={`text-xs px-1.5 py-0.5 rounded ${
          activeTab === tab.key
            ? "bg-blue-600/20 text-blue-400"
            : "bg-gray-800 text-gray-400"
        }`}
      >
        {tab.count}
      </span>
    </button>
  ))}

</div>
        {/* SEARCH */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues..."
              className="bg-transparent outline-none text-sm flex-1 text-white"
            />
          </div>
        </div>

        {/* TABLE + DETAIL */}
        <div className="flex gap-4">

          {/* TABLE */}
          <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

            {loading ? (
              <p className="p-6 text-gray-400">Loading issues...</p>
            ) : issues.length === 0 ? (
              <p className="p-6 text-gray-400">No issues found</p>
            ) : (
              <table className="w-full text-sm">

                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-400">
                    <th className="text-left p-4">ISSUE</th>
                    <th className="text-left p-4">LOCATION</th>
                    <th className="text-left p-4">DEPARTMENT</th>
                    <th className="text-left p-4">SEVERITY</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr
                      key={issue._id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`cursor-pointer ${
                        selectedIssue?._id === issue._id
                          ? "bg-gray-800"
                          : "hover:bg-gray-800/60"
                      }`}
                    >
                      <td className="p-4">
                        <p className="font-semibold">{issue.title}</p>
                        <p className="text-xs text-gray-400">
                          {issue.category}
                        </p>
                      </td>

                      <td className="p-4 text-sm">
                        {issue.zone || "N/A"}
                      </td>

                      <td className="p-4 text-blue-400">
                        {issue.assignedDepartment?.departmentName || "Unassigned"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            severityColors[
                              issue.priority?.level?.toUpperCase()
                            ] || "bg-gray-700"
                          }`}
                        >
                          {issue.priority?.level?.toUpperCase() || "LOW"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </div>

          {/* DETAIL PANEL */}
          <div className="w-80 bg-gray-900 border border-gray-800 rounded-xl p-5">

            {!selectedIssue ? (
              <p className="text-gray-400">Select an issue</p>
            ) : (
              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">
                    #{selectedIssue._id.slice(-6)}
                  </span>

                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="text-gray-400"
                  >
                    <X />
                  </button>
                </div>

                <h3 className="font-bold">
                  {selectedIssue.title}
                </h3>

                <div className="bg-gray-800 h-32 flex items-center justify-center text-gray-500">
                  📸 Image
                </div>

                <p className="text-sm text-gray-400">
                  {selectedIssue.description?.text}
                </p>

                <div className="text-sm text-blue-400">
                  <MapPin className="inline w-4 h-4" />
                  {selectedIssue.zone}
                </div>

                <div className="text-sm">
                  Department:{" "}
                  {selectedIssue.assignedDepartment?.departmentName || "Unassigned"}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
