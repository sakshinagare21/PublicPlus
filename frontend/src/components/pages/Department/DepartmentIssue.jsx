import { useState, useEffect } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCcw,
  X,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Issues = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("New");
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [task, setTask] = useState(null);
  const [issuesData, setIssuesData] = useState([]);
  const [zones, setZones] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  /* ================= FETCH ISSUES ================= */
  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/issues/department/issue?page=${page}&limit=${limit}&zone=${zone}&priority=${priority}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formatted = res.data.issues.map((issue) => ({
        id: issue._id,
        title: issue.title,
        zone: issue.zone,
        priority: issue.priority?.level?.toLowerCase() || "low",
        status:
          issue.status === "reported"
            ? "New"
            : issue.status === "in_progress"
              ? "In Progress"
              : issue.status === "resolved"
                ? "Completed"
                : issue.status,
      }));

      setIssuesData(formatted);

      // ✅ Dynamic zones
      const uniqueZones = [...new Set(res.data.issues.map((i) => i.zone))];
      setZones(uniqueZones);

      setTotalPages(Math.ceil(res.data.total / limit));
    } catch (err) {
      console.error("Issue fetch error:", err);
    }
  };

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/issues/department/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [page, zone, priority]);
  /*==================view single task==================*/
  const fetchTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`http://localhost:5000/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const issue = res.data;

      setTask({
        id: issue._id,
        title: issue.title,
        description: issue.description?.text || "No description",
        location:
          issue.fullAddress ||
          (issue.location?.coordinates
            ? `${issue.location.coordinates[1]}, ${issue.location.coordinates[0]}`
            : "N/A"),
        status: issue.status,
        priority: issue.priority?.level,
        deadline: issue.sla?.resolutionDeadline
          ? new Date(issue.sla.resolutionDeadline).toLocaleString()
          : "N/A",
      });
    } catch (err) {
      console.error(err);
    }
  };

  /*======useeffect for single task details====*/
  useEffect(() => {
    if (selectedId) fetchTask(selectedId);
  }, [selectedId]);

  /* ================= FILTER ================= */
  const filteredIssues = issuesData
    .filter((issue) => issue.status === activeTab)
    .filter((issue) =>
      issue.title.toLowerCase().includes(search.toLowerCase()),
    );

  /* ================= ACTIONS ================= */
  const handleUpdate = (id) => {
    alert(`Update issue ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete issue ${id}`);
  };

  const handleReassign = (id) => {
    alert(`Reassign issue ${id}`);
  };

  return (
    <DepartmentLayout>
      {" "}
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Issues</h1>
          <p className="text-gray-400 text-sm">
            Manage all department-assigned complaints
          </p>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Box title="TOTAL" value={stats.total} />
          <Box title="NEW" value={stats.pending} />
          <Box title="IN PROGRESS" value={stats.inProgress} />
          <Box title="COMPLETED" value={stats.resolved} />
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {["New", "In Progress", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-[#162235] text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#111c2e] p-4 rounded-xl flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex items-center bg-[#0f172a] px-3 py-2 rounded-lg">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent ml-2 outline-none"
            />
          </div>

          {/* Zone */}
          <select
            value={zone}
            onChange={(e) => {
              setZone(e.target.value);
              setPage(1);
            }}
            className="bg-[#0f172a] px-3 py-2 rounded-lg"
          >
            <option value="">All Zones</option>
            {zones.map((z, i) => (
              <option key={i}>{z}</option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="bg-[#0f172a] px-3 py-2 rounded-lg"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#111c2e] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#162235]">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Zone</th>
                <th className="p-4 text-left">Priority</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="border-t border-gray-800">
                  <td className="p-4">{issue.id}</td>
                  <td className="p-4">{issue.title}</td>
                  <td className="p-4">{issue.zone}</td>

                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs bg-yellow-600/20">
                      {issue.priority}
                    </span>
                  </td>

                  <td className="p-4">{issue.status}</td>

                  {/* ACTION BUTTONS */}
                  <td className="p-4 flex gap-3">
                    {/* VIEW */}
                    <Eye
                      size={18}
                      className="cursor-pointer text-purple-400 hover:text-purple-600"
                      onClick={() => setSelectedId(issue.id)}
                    />

                    {/* EDIT */}
                    <Pencil
                      size={18}
                      className="cursor-pointer text-green-400 hover:text-green-600"
                      onClick={() => handleUpdate(issue.id)}
                    />

                    {/* DELETE */}
                    <Trash2
                      size={18}
                      className="cursor-pointer text-red-400 hover:text-red-600"
                      onClick={() => handleDelete(issue.id)}
                    />

                    {/* REASSIGN */}
                    <RefreshCcw
                      size={18}
                      className="cursor-pointer text-blue-400 hover:text-blue-600"
                      onClick={() => handleReassign(issue.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 text-sm text-gray-400 border-t border-gray-800">
            {/* Page Info */}
            <p>
              Page {page} of {totalPages}
            </p>

            {/* Controls */}
            <div className="flex gap-2 items-center">
              {/* Prev */}
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded-lg bg-[#0f172a] border border-gray-700 disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;

                // show only nearby pages (clean UI)
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(page - pageNum) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded-lg border ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-[#0f172a] border-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }

                return null;
              })}

              {/* Next */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded-lg bg-[#0f172a] border border-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*====================================single task modal===================*/}
      {selectedId && task && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          ```
          {/* Modal */}
          <div className="bg-gradient-to-br from-[#111c2e] to-[#0b1120] w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-2xl border border-gray-800">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => {
                setSelectedId(null);
                setTask(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Task Details</h2>
              <p className="text-gray-400 text-sm">
                Complete overview of selected issue
              </p>
            </div>

            {/* TITLE SECTION */}
            <div className="mb-6">
              <p className="text-xs text-gray-500">Task ID: {task.id}</p>
              <h3 className="text-xl font-semibold mt-1">{task.title}</h3>
            </div>

            {/* STATUS + PRIORITY */}
            <div className="flex gap-3 mb-6">
              <span className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-medium">
                {task.status}
              </span>

              <span className="bg-red-600/20 text-red-400 px-4 py-1 rounded-full text-xs flex items-center gap-1 font-medium">
                <AlertTriangle size={14} />
                {task.priority}
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Description</p>
              <p className="text-gray-300 leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Location */}
              <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <MapPin className="text-blue-400" size={18} />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-sm">{task.location}</p>
                </div>
              </div>

              {/* Deadline */}
              <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <Clock className="text-red-400" size={18} />
                <div>
                  <p className="text-xs text-gray-400">Deadline</p>
                  <p className="text-sm text-red-400">{task.deadline}</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4 border-t border-gray-800">
              <button className="flex-1 bg-green-600 hover:bg-green-700 transition py-2 rounded-lg font-medium">
                Mark Completed
              </button>

              <button className="flex-1 bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium">
                Upload Proof
              </button>
            </div>
          </div>
          ```
        </div>
      )}
    </DepartmentLayout>
  );
};

/* SMALL COMPONENT */
const Box = ({ title, value }) => (
  <div className="bg-[#111c2e] p-4 rounded-xl">
    <p className="text-xs text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default Issues;
