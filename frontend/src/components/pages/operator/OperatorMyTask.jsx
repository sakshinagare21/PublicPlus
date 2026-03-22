import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
Clock,
ChevronLeft,
ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OperatorMyTasks = () => {
const [activeTab, setActiveTab] = useState("All");
const [tasks, setTasks] = useState([]);
const [stats, setStats] = useState({
pending: 0,
inProgress: 0,
completed: 0,
});

const navigate = useNavigate();

/* ================= FETCH ISSUES ================= */
const fetchIssues = async () => {
try {
const res = await axios.get(
"http://localhost:5000/api/issues/operator/issue", // ✅ FIXED URL
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
}
);

  console.log("TOKEN:", localStorage.getItem("token"));

  const formatted = res.data.map((issue) => ({
    id: issue._id,
    title: issue.title,

    // ✅ FIXED LOCATION (IMPORTANT)
    location: issue.fullAddress
      ? issue.fullAddress
      : issue.location?.coordinates
      ? `Lat: ${issue.location.coordinates[1]}, Lng: ${issue.location.coordinates[0]}`
      : "N/A",

    status:
      issue.status === "reported"
        ? "Pending"
        : issue.status === "in_progress"
        ? "In Progress"
        : "Completed",

    deadline: issue.sla?.resolutionDeadline
      ? new Date(issue.sla.resolutionDeadline).toLocaleString()
      : "N/A",
  }));

  setTasks(formatted);
} catch (err) {
  console.error("Error fetching issues:", err);
}


};

/* ================= FETCH STATS ================= */
const fetchStats = async () => {
try {
const res = await axios.get(
"http://localhost:5000/api/issues/operator/stats",
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
}
);

  setStats({
    pending: res.data.pending,
    inProgress: res.data.inProgress,
    completed: res.data.completed,
  });
} catch (err) {
  console.error("Error fetching stats:", err);
}


};

/* ================= USE EFFECT ================= */
useEffect(() => {
fetchIssues();
fetchStats();
}, []);

/* ================= FILTER ================= */
const filteredTasks =
activeTab === "All"
? tasks
: tasks.filter((task) => task.status === activeTab);

return ( <OperatorLayout> <div className="space-y-8">

    {/* HEADER */}
    <div>
      <h1 className="text-2xl font-bold">Daily Task Assignment</h1>
      <p className="text-gray-400 text-sm mt-1">
        Manage and track your field service operations for today.
      </p>
    </div>

    {/* FILTER */}
    <div className="flex gap-3">
      {["All", "Pending", "In Progress"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-lg text-sm transition ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-[#111c2e] border border-gray-800 text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-xs uppercase">
          Pending Tasks
        </p>
        <h2 className="text-3xl font-bold mt-3">
          {stats.pending}
        </h2>
      </div>

      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-xs uppercase">
          In Progress
        </p>
        <h2 className="text-3xl font-bold mt-3">
          {stats.inProgress}
        </h2>
      </div>

      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
        <p className="text-gray-400 text-xs uppercase">
          Completed Today
        </p>
        <h2 className="text-3xl font-bold mt-3">
          {stats.completed}
        </h2>
      </div>

    </div>

    {/* TABLE */}
    <div className="bg-[#111c2e] border border-gray-800 rounded-xl overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs">
          <tr>
            <th className="text-left p-4">Task Title</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">SLA Deadline</th>
            <th className="text-right p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.map((task, index) => (
            <tr
              key={index}
              className="border-t border-gray-800 hover:bg-[#162235] transition"
            >
              <td className="p-4">
                {/* <p className="text-xs text-gray-400">
                  {task.id}
                </p> */}
                <p className="font-medium">
                  {task.title}
                </p>
                <p className="text-gray-400 text-xs">
                  {task.location}
                </p>
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    task.status === "Pending"
                      ? "bg-yellow-600/20 text-yellow-400"
                      : "bg-blue-600/20 text-blue-400"
                  }`}
                >
                  {task.status}
                </span>
              </td>

              <td className="p-4 flex items-center gap-2 text-gray-300">
                <Clock size={14} />
                {task.deadline}
              </td>

              <td className="p-4 text-right">
                <button
                  onClick={() =>
                    navigate(`/operator/tasks/${task.id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 text-sm text-gray-400 border-t border-gray-800">
        <p>Showing {tasks.length} tasks</p>

        <div className="flex gap-2">
          <button className="bg-[#0f172a] border border-gray-700 p-2 rounded-lg">
            <ChevronLeft size={16} />
          </button>
          <button className="bg-[#0f172a] border border-gray-700 p-2 rounded-lg">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>

  </div>
</OperatorLayout>


);
};

export default OperatorMyTasks;
