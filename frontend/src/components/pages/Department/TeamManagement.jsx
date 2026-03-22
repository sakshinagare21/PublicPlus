import { useState, useEffect } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import { Plus, MapPin } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [operators, setOperators] = useState([]);
  const [operatorDetails, setOperatorDetails] = useState(null);
  const [operatorStats, setOperatorStats] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const token = localStorage.getItem("token");

  /* ================= FETCH OPERATORS ================= */
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/departments/operators",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setOperators(res.data);
      } catch (err) {
        toast.error("Failed to load operators");
      }
    };

    fetchOperators();
  }, []);

  /* ================= FETCH OPERATOR DETAILS ================= */
  const fetchOperatorDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const profileRes = await axios.get(
        `http://localhost:5000/api/operator/department/operator/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const statsRes = await axios.get(
        `http://localhost:5000/api/operator/department/operator/${id}/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOperatorDetails(profileRes.data);
      setOperatorStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER ================= */
  const filteredOperators =
    activeTab === "All"
      ? operators
      : activeTab === "High"
        ? operators.filter((op) => op.currentActiveTasks >= 7)
        : operators.filter((op) => op.currentActiveTasks < 4);

  return (
    <DepartmentLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Department Operators</h1>
            <p className="text-gray-400 text-sm">
              Manage workload and performance for service teams
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={16} />
            Add New Operator
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-800 pb-2 text-sm">
          <button
            onClick={() => setActiveTab("All")}
            className={`${
              activeTab === "All"
                ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                : "text-gray-400"
            }`}
          >
            All Operators ({operators.length})
          </button>

          <button
            onClick={() => setActiveTab("High")}
            className={`${
              activeTab === "High"
                ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                : "text-gray-400"
            }`}
          >
            High Workload
          </button>

          <button
            onClick={() => setActiveTab("Available")}
            className={`${
              activeTab === "Available"
                ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                : "text-gray-400"
            }`}
          >
            Available
          </button>
        </div>

        {/* Operator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredOperators.map((op) => {
            const workloadPercent =
              ((op.currentActiveTasks || 0) / (op.maxCapacity || 1)) * 100;

            return (
              <div
                key={op._id}
                className={`bg-[#111c2e] border rounded-xl overflow-hidden transition hover:scale-[1.02]
                ${
                  workloadPercent >= 80
                    ? "border-yellow-500"
                    : "border-gray-800"
                }`}
              >
                {/* Avatar */}
                <div className="relative h-48 bg-gray-800 flex items-center justify-center text-4xl font-bold">
                  {op.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}

                  {/* Status */}
                  <span
                    className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full
                    ${op.status === "active" ? "bg-green-600" : "bg-gray-600"}`}
                  >
                    {op.status}
                  </span>

                  {/* High workload */}
                  {workloadPercent >= 80 && (
                    <span className="absolute top-3 left-3 px-2 py-1 text-xs rounded-full bg-yellow-500 text-black">
                      HIGH WORKLOAD
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{op.fullName}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} />
                    {op.assignedZone?.zoneName || "No Zone"}
                  </div>

                  {/* Active Tasks */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Active Tasks</span>
                      <span>
                        {op.currentActiveTasks} / {op.maxCapacity}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-800 rounded">
                      <div
                        className={`h-2 rounded ${
                          workloadPercent >= 80
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: `${workloadPercent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOperator(op._id);
                      fetchOperatorDetails(op._id);
                    }}
                    className="w-full mt-3 border border-gray-700 rounded-lg py-2 hover:bg-[#162235] transition text-sm"
                  >
                    View Stats
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency */}
        <div className="fixed bottom-6 left-6">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg shadow-lg">
            🚨 Emergency Alert
          </button>
        </div>
      </div>

      {/* Modal for operator details - can be implemented using a state variable to show/hide and populate with selected operator's data */}
      {selectedOperator && operatorDetails && operatorStats && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#111c2e] to-[#0b1120] w-[700px] rounded-2xl p-6 border border-gray-800 shadow-2xl relative">
            {/* CLOSE */}
            <button
              onClick={() => {
                setSelectedOperator(null);
                setOperatorDetails(null);
                setOperatorStats(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">
                {operatorDetails.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {operatorDetails.fullName}
                </h2>
                <p className="text-gray-400 text-sm">{operatorDetails.email}</p>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex gap-3 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  operatorDetails.status === "active"
                    ? "bg-green-600/20 text-green-400"
                    : "bg-gray-600/20 text-gray-400"
                }`}
              >
                {operatorDetails.status}
              </span>

              <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                {operatorDetails.assignedZone?.zoneName || "No Zone"}
              </span>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400">Total</p>
                <h3 className="text-xl font-bold">{operatorStats.total}</h3>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400">Pending</p>
                <h3 className="text-xl font-bold text-yellow-400">
                  {operatorStats.pending}
                </h3>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400">In Progress</p>
                <h3 className="text-xl font-bold text-blue-400">
                  {operatorStats.inProgress}
                </h3>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-xl text-center">
                <p className="text-xs text-gray-400">Completed</p>
                <h3 className="text-xl font-bold text-green-400">
                  {operatorStats.completed}
                </h3>
              </div>
            </div>

            {/* WORKLOAD */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Workload</span>
                <span>
                  {operatorDetails.currentActiveTasks} /{" "}
                  {operatorDetails.maxCapacity}
                </span>
              </div>

              <div className="w-full h-3 bg-gray-800 rounded-full">
                <div
                  className="h-3 bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      (operatorDetails.currentActiveTasks /
                        operatorDetails.maxCapacity) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* PERFORMANCE */}
            <div className="bg-[#0f172a] p-4 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Performance</p>

              <p className="text-lg font-semibold">
                {operatorStats.total > 0
                  ? Math.round(
                      (operatorStats.completed / operatorStats.total) * 100,
                    )
                  : 0}
                % Completion Rate
              </p>
            </div>
          </div>
        </div>
      )}
    </DepartmentLayout>
  );
};

export default TeamManagement;
