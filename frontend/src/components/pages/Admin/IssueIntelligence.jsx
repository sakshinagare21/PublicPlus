import { useState } from "react";
import toast from "react-hot-toast";
import { Search, Plus, X, MapPin } from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const issues = [
  {
    id: "ISS-82910",
    title: "Major Pothole",
    category: "Infrastructure & Safety",
    location: "452 Madison Ave",
    zone: "Zone A-12 (Central)",
    severity: "CRITICAL",
    aiScore: 92,
    description:
      "Large pothole approximately 12 inches deep located in the center lane. Creating significant traffic slowing and tire damage risks for motorists.",
  },
  {
    id: "ISS-82911",
    title: "Flickering Street Light",
    category: "Utilities & Power",
    location: "78 Oak Street",
    zone: "Zone C-04 (North)",
    severity: "PENDING",
    aiScore: 67,
    description:
      "Street light flickering intermittently. Reported by multiple residents.",
  },
  {
    id: "ISS-82912",
    title: "Overflowing Waste",
    category: "Sanitation",
    location: "Public Plaza B",
    zone: "Zone A-05 (Central)",
    severity: "LOW",
    aiScore: 45,
    description:
      "Waste containers overflowing near public plaza area.",
  },
  {
    id: "ISS-82913",
    title: "Main Pipe Burst",
    category: "Water & Sewage",
    location: "22 Industrial Way",
    zone: "Zone E-09 (East)",
    severity: "CRITICAL",
    aiScore: 88,
    description:
      "Main water pipe burst causing flooding in the area.",
  },
];

const severityColors = {
  CRITICAL: "bg-red-500/20 text-red-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  LOW: "bg-green-500/20 text-green-400",
};

export default function IssueIntelligence() {
  const [activeTab, setActiveTab] = useState("All Issues");
  const [selectedIssue, setSelectedIssue] = useState(issues[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { label: "All Issues", count: 842 },
    { label: "Pending", count: 126 },
    { label: "Critical", count: 14 },
    { label: "Resolved", count: null },
  ];

  return (
     <AdminLayout>
    <div className="space-y-4 text-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Issue Management</h1>
          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-md">
            1,284 Total Cases
          </span>
          <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded-md">
            +24 Resolved Today
          </span>
        </div>

        <button
          onClick={() => toast("Opening report form...")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Manual Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label);
              toast(`Showing ${tab.label}`);
            }}
            className={`pb-3 text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.label
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  activeTab === tab.label
                    ? "bg-blue-600/20 text-blue-400"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">

        <div className="flex-1 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, or team..."
            className="bg-transparent outline-none text-sm flex-1 text-white placeholder-gray-500"
          />
        </div>

        {["Category: All", "Zone: All Districts", "Severity: High Priority"].map(
          (f) => (
            <button
              key={f}
              onClick={() => toast(`${f} filter toggled`)}
              className="text-sm px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-colors"
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* Table + Detail */}
      <div className="flex gap-4">

        {/* Table */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400 tracking-wider">
                <th className="text-left p-4">ISSUE & CATEGORY</th>
                <th className="text-left p-4">LOCATION (ZONE)</th>
                <th className="text-left p-4">SEVERITY</th>
                <th className="text-left p-4">AI SCORE</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`border-b border-gray-800 cursor-pointer transition-colors ${
                    selectedIssue?.id === issue.id
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

                  <td className="p-4">
                    <p className="text-sm">{issue.location}</p>
                    <p className="text-xs text-blue-400">{issue.zone}</p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${
                        severityColors[issue.severity]
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          issue.aiScore > 80
                            ? "bg-green-500"
                            : issue.aiScore > 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${issue.aiScore}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Detail Panel */}
        {selectedIssue && (
          <div className="w-80 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 shrink-0">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  #{selectedIssue.id}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    severityColors[selectedIssue.severity]
                  }`}
                >
                  {selectedIssue.severity}
                </span>
              </div>

              <button
                onClick={() => setSelectedIssue(issues[0])}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-lg">
              {selectedIssue.title} Report
            </h3>

            <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center text-gray-500 text-sm">
              📸 Issue Photo
            </div>

            <div>
              <p className="text-xs text-blue-400 tracking-wider mb-2">
                GEOLOCATION
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin className="w-3 h-3" />
                {selectedIssue.location}, {selectedIssue.zone}
              </div>
            </div>

            <div>
              <p className="text-xs text-blue-400 tracking-wider mb-2">
                FULL DESCRIPTION
              </p>
              <p className="text-sm text-gray-400">
                {selectedIssue.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  toast.success(
                    `${selectedIssue.id} assigned to field team`
                  )
                }
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Assign Team
              </button>

              <button
                onClick={() =>
                  toast.error(
                    `${selectedIssue.id} escalated to supervisor`
                  )
                }
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Escalate
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
   </AdminLayout>
  );
}
