import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CategorySettings() {

  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchTypes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/issue-types", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setTypes(data.types);
      }

    } catch (err) {
      toast.error("Failed to load issue types");
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  /* ================= ADD ================= */
  const addType = async () => {
    if (!name.trim()) {
      return toast.error("Enter issue type");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/issue-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Issue type added");
        setName("");
        fetchTypes();
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      toast.error("Error adding issue type");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteType = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/issue-types/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Deleted");
      fetchTypes();

    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Issue Types</h2>
        <p className="text-gray-400 text-sm">
          Manage all available issue categories
        </p>
      </div>

      {/* ADD CARD */}
      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">

        <h3 className="mb-4 font-semibold">Add Issue Type</h3>

        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter issue type (e.g. pothole)"
            className="flex-1 bg-[#0f172a] border border-gray-700 px-3 py-2 rounded"
          />

          <button
            onClick={addType}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* LIST CARD */}
      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">

        <h3 className="mb-4 font-semibold">All Issue Types</h3>

        {types.length === 0 ? (
          <p className="text-gray-500">No issue types found</p>
        ) : (
          <div className="space-y-2">

            {types.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center bg-[#0f172a] border border-gray-700 px-4 py-2 rounded"
              >
                <span className="capitalize">{t.label}</span>

                <button
                  onClick={() => deleteType(t._id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}