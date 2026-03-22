import { useState, useEffect } from "react";
import axios from "axios";
import DepartmentLayout from "../../layout/DepartmentLayout";
import toast from "react-hot-toast";
const IssueTypeForm = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [takenTypes, setTakenTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const issueOptions = [
    "pothole",
    "road_damage",
    "garbage",
    "drain",
    "water",
    "streetlight",
    "traffic_signal",
    "encroachment",
    "public_toilet",
    "fire",
  ];

  /* ================= FETCH TAKEN TYPES ================= */
  const fetchTaken = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/departments/taken-types",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTakenTypes(res.data);
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

      setSelectedTypes(res.data.issueTypes || []);
    } catch (err) {
      console.log("Error fetching department data");
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchTaken();
    fetchMyDepartment();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
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

      /* 🔥 UPDATE UI WITHOUT REFRESH */
      setSelectedTypes(res.data.department.issueTypes);

      /* 🔥 REFRESH TAKEN TYPES */
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

            {issueOptions.map((type) => {
              const isTaken = takenTypes.includes(type);
              const isSelected = selectedTypes.includes(type);

              return (
                <div
                  key={type}
                  className={`p-4 rounded-xl border cursor-pointer transition 
                  ${isTaken
                    ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                    : "bg-[#0f172a] border-gray-700 hover:border-blue-500"}
                  ${isSelected ? "border-blue-500 bg-blue-500/10" : ""}
                  `}
                  onClick={() => !isTaken && handleChange(type)}
                >
                  <div className="flex items-center justify-between">

                    <span className="capitalize text-sm font-medium">
                      {type.replace("_", " ")}
                    </span>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isTaken}
                      onChange={(e) => {
                        e.stopPropagation(); // 🔥 FIX DOUBLE CLICK BUG
                        handleChange(type);
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

            {/* CANCEL */}
            <button
              onClick={handleReset}
              className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            {/* SAVE */}
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