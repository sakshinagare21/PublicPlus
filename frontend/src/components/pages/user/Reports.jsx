import DashboardLayout from "../../layout/DashboardLayout";
import {
  Plus,
  Search,
  MapPin,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Reports = () => {
  const [issues, setIssues] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState(0);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchIssues = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/issues/my?page=${pageNumber}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data.issues || [];

      setIssues(data);
      setFiltered(data);
      setTotal(res.data.total);
      setPage(res.data.page);

    } catch (err) {
      toast.error("Failed to load issues");
    }
  };

  useEffect(() => {
    fetchIssues(page);
  }, [page]);

  /* ================= FILTER ================= */
  const handleTab = (index) => {
    setActiveTab(index);

    if (index === 0) return setFiltered(issues);

    if (index === 1)
      return setFiltered(issues.filter((i) => i.status === "reported"));

    if (index === 2)
      return setFiltered(issues.filter((i) => i.status === "in_progress"));

    if (index === 3)
      return setFiltered(issues.filter((i) => i.status === "resolved"));
  };

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const result = issues.filter(
      (i) =>
        i.title.toLowerCase().includes(value) ||
        i.category.toLowerCase().includes(value)
    );

    setFiltered(result);
  };

  /* ================= STATUS COLOR ================= */
  const getStatusColor = (status) => {
    if (status === "resolved") return "bg-green-500 text-white";
    if (status === "in_progress") return "bg-blue-500 text-white";
    if (status === "reported") return "bg-yellow-400 text-black";
    return "bg-gray-400 text-white";
  };

  const selectedIssue = filtered[selected] || {};

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(total / limit);

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6">

        {/* LEFT SIDE */}
        <div className="flex-1">

          {/* HEADER */}
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                My Reported Issues
              </h1>
              <p className="text-sm text-gray-500">
                Track your submitted issues
              </p>
            </div>

            <Link to="/post-report">
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2">
                <Plus size={16} />
                New Issue
              </button>
            </Link>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-4">
            {["All", "Pending", "In Progress", "Resolved"].map((tab, i) => (
              <button
                key={i}
                onClick={() => handleTab(i)}
                className={`px-4 py-2 rounded ${
                  i === activeTab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              onChange={handleSearch}
              placeholder="Search..."
              className="pl-10 w-full border p-2 rounded"
            />
          </div>

          {/* CARDS */}
          <div className="grid sm:grid-cols-2 gap-4">
            {(filtered || []).map((issue, i) => (
              <button
                key={issue._id}
                onClick={() => setSelected(i)}
                className={`border p-4 rounded text-left ${
                  selected === i ? "border-blue-500" : ""
                }`}
              >
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>

                <h3 className="font-semibold mt-2">
                  {issue.title}
                </h3>

                <p className="text-xs text-gray-500">
                  {issue.category}
                </p>

                <div className="flex gap-1 text-xs text-gray-500 mt-2">
                  <MapPin size={12} />
                  {issue.zone}
                </div>
              </button>
            ))}
          </div>

          {/* PAGINATION UI */}
          <div className="flex justify-between items-center mt-6">

            <button
              onClick={prevPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        {selectedIssue && (
          <div className="w-96 border p-4 rounded hidden xl:block">

            <h2 className="font-bold text-lg">
              {selectedIssue.title}
            </h2>

            <p className="text-sm text-gray-500 mb-3">
              {selectedIssue.category}
            </p>

            <div className="bg-gray-100 p-3 rounded mb-3">
              <p className="text-sm">
                Zone: {selectedIssue.zone}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Timeline</p>

              <p className="text-sm">
                📍 Reported:{" "}
                {new Date(selectedIssue.createdAt).toLocaleString()}
              </p>

              {selectedIssue.status === "in_progress" && (
                <p className="text-sm">🚧 In Progress</p>
              )}

              {selectedIssue.status === "resolved" && (
                <p className="text-sm">✅ Resolved</p>
              )}
            </div>

            <Link to={`/issue/${selectedIssue._id}`}>
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                <Eye size={16} /> View Details
              </button>
            </Link>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Reports;