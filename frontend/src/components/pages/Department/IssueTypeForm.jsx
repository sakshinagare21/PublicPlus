import { useState, useEffect } from "react";
import axios from "axios";
import DepartmentLayout from "../../layout/DepartmentLayout";
import toast from "react-hot-toast";

const IssueTypeForm = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [takenTypes, setTakenTypes] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH ISSUE TYPES (FROM ADMIN) ================= */
  const fetchIssueTypes = async () => {
    try {
      const res = await axios.get(
  "http://localhost:5000/api/issue-types",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setIssueTypes(res.data.types); // {_id, name, label}

    } catch (err) {
      console.log("Error fetching issue types");
    }
  };

  /* ================= FETCH TAKEN TYPES ================= */
  const fetchTaken = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/departments/taken-types",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // only store IDs
      setTakenTypes(res.data.taken.map((t) => t._id));

    } catch (err) {
      console.log("Error fetching taken types");
    }
  };

  /* ================= FETCH CURRENT DEPARTMENT ================= */
  const fetchMyDepartment = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/departments/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ids =
        res.data.issueTypes?.map((t) => t._id) || [];

      setSelectedTypes(ids);

    } catch (err) {
      console.log("Error fetching department data");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchIssueTypes();   // 🔥 from admin DB
    fetchTaken();
    fetchMyDepartment();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id]
    );
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    setSelectedTypes([]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:5000/api/departments/issue-types",
        { issueTypes: selectedTypes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedIds = res.data.department.issueTypes.map(
        (id) => id.toString()
      );

      setSelectedTypes(updatedIds);

      await fetchTaken();

      toast.success("Issue types updated successfully");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout>
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Issue Type Configuration
          </h2>
          <p className="text-gray-400 text-sm">
            Select the issue types your department will handle.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#0b1624] border border-gray-800 rounded-2xl p-6 shadow-lg">

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {issueTypes.map((type) => {
              const isTaken = takenTypes.includes(type._id);
              const isSelected = selectedTypes.includes(type._id);

              return (
                <div
                  key={type._id}
                  className={`p-4 rounded-xl border cursor-pointer transition 
                  ${isTaken
                    ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                    : "bg-[#0f172a] border-gray-700 hover:border-blue-500"}
                  ${isSelected ? "border-blue-500 bg-blue-500/10" : ""}
                  `}
                  onClick={() => !isTaken && handleChange(type._id)}
                >
                  <div className="flex items-center justify-between">

                    <span className="capitalize text-sm font-medium">
                      {type.label}
                    </span>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isTaken}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleChange(type._id);
                      }}
                      className="accent-blue-500"
                    />
                  </div>

                  {isTaken && (
                    <p className="text-xs text-red-400 mt-2">
                      Already assigned
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-8">

            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || selectedTypes.length === 0}
              className={`px-6 py-2 rounded-lg font-medium transition
                ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
};

export default IssueTypeForm;