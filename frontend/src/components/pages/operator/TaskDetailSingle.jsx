import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import axios from "axios";

const TaskDetailSingle = () => {
const { id } = useParams();

const [task, setTask] = useState(null);

/* ================= FETCH ISSUE BY ID ================= */
const fetchTask = async () => {
try {
const res = await axios.get(
`http://localhost:5000/api/issues/${id}`,
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
}
);


  const issue = res.data;

  // ✅ MAP BACKEND → FRONTEND
  const formatted = {
    id: issue._id,
    title: issue.title,

    description: issue.description?.text || "No description",

    // ✅ FIX LOCATION
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
        : issue.status === "resolved"
        ? "Completed"
        : issue.status,

    priority: issue.priority?.level || "Low",

    deadline: issue.sla?.resolutionDeadline
      ? new Date(issue.sla.resolutionDeadline).toLocaleString()
      : "N/A",

    department:
      issue.assignedDepartment?.departmentName || "N/A",

    assignedDate: issue.createdAt
      ? new Date(issue.createdAt).toLocaleDateString()
      : "N/A",
  };

  setTask(formatted);
} catch (err) {
  console.error("Error fetching task:", err);
}


};

useEffect(() => {
fetchTask();
}, [id]);

/* ================= LOADING ================= */
if (!task) {
return ( <OperatorLayout> <p className="p-6 text-gray-400">Loading...</p> </OperatorLayout>
);
}

return ( <OperatorLayout> <div className="space-y-8">


    {/* HEADER */}
    <div>
      <h1 className="text-2xl font-bold">
        Task Details
      </h1>
      <p className="text-gray-400 text-sm">
        Detailed view of assigned task
      </p>
    </div>

    {/* MAIN CARD */}
    <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-8 space-y-6">

      {/* Title */}
      <div>
        <p className="text-xs text-gray-400">
          Task ID: {task.id}
        </p>
        <h2 className="text-xl font-semibold mt-1">
          {task.title}
        </h2>
      </div>

      {/* Status + Priority */}
      <div className="flex gap-4">
        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
          {task.status}
        </span>

        <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <AlertTriangle size={14} />
          {task.priority}
        </span>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-sm text-gray-400 mb-2">
          Description
        </h3>
        <p className="text-gray-300">
          {task.description}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-300">
        <MapPin size={16} />
        {task.location}
      </div>

      {/* SLA */}
      <div className="flex items-center gap-2 text-red-400">
        <Clock size={16} />
        SLA Deadline: {task.deadline}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6 text-sm">

        <div>
          <p className="text-gray-400">Department</p>
          <p>{task.department}</p>
        </div>

        <div>
          <p className="text-gray-400">Assigned Date</p>
          <p>{task.assignedDate}</p>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">

        <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition">
          Mark as Completed
        </button>

        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
          Upload Proof
        </button>

      </div>

    </div>

  </div>
</OperatorLayout>

);
};

export default TaskDetailSingle;
