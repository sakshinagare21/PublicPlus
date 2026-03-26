import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Download,
  Search,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

export default function Departments() {

  const [activeTab, setActiveTab] = useState("Department List");
  const [searchQuery, setSearchQuery] = useState("");

  const [departments, setDepartments] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [zones, setZones] = useState([]);

  const [stats, setStats] = useState({
    totalDepartments: 0,
    activeOperators: 0,
    avgResolutionTime: 0
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/departments", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setDepartments(data.departments || []);
        setStats(prev => ({
          ...prev,
          totalDepartments: data.count
        }));
      }

    } catch {
      toast.error("Failed to load departments");
    }
  };

  const fetchOperators = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/operators", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setTeamMembers(data.operators || []);
        setStats(prev => ({
          ...prev,
          activeOperators: data.count
        }));
      }

    } catch {
      toast.error("Failed to load operators");
    }
  };

  const fetchZones = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/zones", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setZones(data.zones || []);
      }

    } catch {
      toast.error("Failed to load zones");
    }
  };

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetchDepartments(),
      fetchOperators(),
      fetchZones()
    ]).finally(() => setLoading(false));

  }, []);

  /* ================= FILTER ================= */

  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 text-gray-200">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Home › Departments</p>
            <h1 className="text-2xl font-bold">Department Management</h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search departments..."
                className="bg-transparent outline-none text-sm w-40 text-white"
              />
            </div>

            <button
              onClick={() => toast("Opening department form...")}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>

            <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg">
              <Download className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-400">Total Departments</p>
            <p className="text-2xl font-bold">{stats.totalDepartments}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-400">Avg Resolution</p>
            <p className="text-2xl font-bold">{stats.avgResolutionTime} min</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-400">Active Operators</p>
            <p className="text-2xl font-bold">{stats.activeOperators}</p>
          </div>

        </div>

        {/* TABLE WITH TABS */}
        {/* TABLE WITH TABS */}
<div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

  {/* MODERN TABS */}
  <div className="flex gap-2 p-4 bg-gray-900 border-b border-gray-800">

    {["Department List", "Zone Mapping", "Team Members"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
          activeTab === tab
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
        }`}
      >
        {tab}
      </button>
    ))}

  </div>

  {/* CONTENT */}
  <div className="p-4">

    {loading ? (
      <p className="text-center text-gray-400 py-10">Loading...</p>
    ) : activeTab === "Department List" ? (

      <table className="w-full text-sm text-center border-separate border-spacing-y-2">

        <thead>
          <tr className="text-xs text-gray-400 uppercase">
            <th className="p-3">Department</th>
            <th className="p-3">Email</th>
            <th className="p-3">City</th>
            <th className="p-3">Tickets</th>
            <th className="p-3">Efficiency</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredDepartments.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">📭</p>
                  <p>No departments available</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredDepartments.map((dept) => (
              <tr key={dept._id} className="bg-gray-800 hover:bg-gray-700 transition rounded-lg">

                <td className="p-3">
                  <p className="font-semibold">{dept.departmentName}</p>
                  <p className="text-xs text-gray-400">{dept.departmentCode}</p>
                </td>

                <td className="p-3">{dept.email}</td>

                <td className="p-3">{dept.city}</td>

                <td className="p-3">
                  {dept.performanceMetrics?.totalIssuesHandled || 0}
                </td>

                <td className="p-3">
                  {dept.performanceMetrics?.slaComplianceRate || 0}%
                </td>

                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    {dept.accountStatus}
                  </span>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    ) : activeTab === "Team Members" ? (

      <table className="w-full text-sm text-center border-separate border-spacing-y-2">

        <thead>
          <tr className="text-xs text-gray-400 uppercase">
            <th className="p-3">Name</th>
            <th className="p-3">Department</th>
            <th className="p-3">Zone</th>
            <th className="p-3">Tasks</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {teamMembers.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">📭</p>
                  <p>No operators available</p>
                </div>
              </td>
            </tr>
          ) : (
            teamMembers.map((op) => (
              <tr key={op._id} className="bg-gray-800 hover:bg-gray-700 transition rounded-lg">

                <td className="p-3">{op.fullName}</td>

                <td className="p-3">
                  {op.departmentId?.departmentName || "N/A"}
                </td>

                <td className="p-3">
                  {op.assignedZone?.zoneName || "N/A"}
                </td>

                <td className="p-3">
                  {op.currentActiveTasks}/{op.maxCapacity}
                </td>

                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                    {op.status}
                  </span>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>

    ) : (

      <table className="w-full text-sm text-center border-separate border-spacing-y-2">

        <thead>
          <tr className="text-xs text-gray-400 uppercase">
            <th className="p-3">Zone Name</th>
            <th className="p-3">Zone Code</th>
          </tr>
        </thead>

        <tbody>
          {zones.length === 0 ? (
            <tr>
              <td colSpan="2" className="py-12 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-lg">📭</p>
                  <p>No zones available</p>
                </div>
              </td>
            </tr>
          ) : (
            zones.map((zone, i) => (
              <tr key={i} className="bg-gray-800 hover:bg-gray-700 transition rounded-lg">
                <td className="p-3">{zone.zoneName}</td>
                <td className="p-3">{zone.zoneCode}</td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    )}

  </div>
</div>

      </div>
    </AdminLayout>
  );
}