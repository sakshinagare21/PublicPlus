import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SLASettings() {
  const [priority, setPriority] = useState("critical");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 🔥 NEW STATE
  const [allSLA, setAllSLA] = useState([]);

  /* ================= FETCH SINGLE SLA ================= */
  useEffect(() => {
    fetchSLA();
    fetchAllSLA(); // 🔥 also fetch table data
  }, [priority]);

  const fetchSLA = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // or firebase token

      const res = await fetch(
        `http://localhost:5000/api/sla/get-sla?priority=${priority}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (data.success && data.sla) {
        setLevels(data.sla.levels || []);
        setLastUpdated(data.sla.updatedAt);
      } else {
        setLevels([{ level: 1, value: 2, unit: "hours" }]);
        setLastUpdated(null);
      }
    } catch (err) {
      toast.error("Failed to load SLA");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH ALL SLA ================= */
  const fetchAllSLA = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/sla/get-sla", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.success) {
      setAllSLA(data.sla || []);
    } else {
      toast.error(data.message);
    }

  } catch (err) {
    toast.error("Failed to load SLA table");
  }
};

  /* ================= UPDATE LEVEL ================= */
  const updateLevel = (i, key, value) => {
    const updated = [...levels];
    updated[i][key] = value;
    setLevels(updated);
  };

  /* ================= ADD LEVEL ================= */
  const addLevel = () => {
    setLevels([
      ...levels,
      {
        level: levels.length + 1,
        value: 1,
        unit: "days",
      },
    ]);
  };

  /* ================= DELETE LEVEL ================= */
  const deleteLevel = (index) => {
    const updated = levels.filter((_, i) => i !== index);
    const fixed = updated.map((lvl, i) => ({
      ...lvl,
      level: i + 1,
    }));
    setLevels(fixed);
  };

  /* ================= SAVE SLA ================= */
const saveSLA = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token"); // 🔥 get token

    const res = await fetch("http://localhost:5000/api/sla/set-sla", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🔥 ADD THIS
      },
      body: JSON.stringify({
        priority,
        levels,
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("SLA Updated Successfully");
      fetchSLA();
      fetchAllSLA();
    } else {
      toast.error(data.message);
    }

  } catch (err) {
    toast.error("Error saving SLA");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">SLA Configuration</h2>
        <p className="text-gray-400 text-sm">
          Define escalation timing rules for each priority level
        </p>

        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-5">
        {/* PRIORITY */}
        <div>
          <label className="text-sm text-gray-400">Select Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full mt-2 bg-[#0f172a] border border-gray-700 rounded-lg p-3"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {loading && <p className="text-blue-400 text-sm">Loading SLA...</p>}

        {!loading && (
          <div>
            <h3 className="font-semibold mb-3">Escalation Levels</h3>

            {levels.map((lvl, i) => (
              <div
                key={i}
                className="flex gap-3 items-center mb-3 bg-[#0f172a] p-3 rounded-lg border border-gray-700"
              >
                <span className="text-sm text-gray-400 w-16">
                  Level {lvl.level}
                </span>

                <input
                  type="number"
                  value={lvl.value}
                  onChange={(e) =>
                    updateLevel(i, "value", Number(e.target.value))
                  }
                  className="w-24 bg-gray-800 px-3 py-2 rounded"
                />

                <select
                  value={lvl.unit}
                  onChange={(e) => updateLevel(i, "unit", e.target.value)}
                  className="bg-gray-800 px-3 py-2 rounded"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>

                <button
                  onClick={() => deleteLevel(i)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={addLevel}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            + Add Level
          </button>

          <button
            onClick={saveSLA}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg flex-1"
          >
            {loading ? "Saving..." : "Save SLA"}
          </button>
        </div>
      </div>

      {/* ================= SLA TABLE ================= */}
      <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Current SLA Configuration
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2 text-left">Priority</th>
              <th className="py-2 text-left">Levels</th>
              <th className="py-2 text-left">Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {allSLA.map((sla, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td className="py-3 capitalize">{sla.priority}</td>

                <td className="py-3">
                  {sla.levels.map((lvl) => (
                    <div key={lvl.level}>
                      L{lvl.level}: {lvl.value} {lvl.unit}
                    </div>
                  ))}
                </td>

                <td className="py-3 text-gray-400">
                  {sla.updatedAt
                    ? new Date(sla.updatedAt).toLocaleString()
                    : "Not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
