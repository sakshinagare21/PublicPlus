import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DepartmentLayout from "../../layout/DepartmentLayout";

const OperatorRequests = () => {
  const [operators, setOperators] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState({});
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOperators();
    fetchZones();
    fetchNotifications();
  }, []);

  /* ================= FETCH OPERATORS ================= */
  const fetchOperators = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/departments/pending-operators",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      setOperators(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH ZONES ================= */
  const fetchZones = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/departments/my-zones",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      setZones(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notification/department",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= APPROVE ================= */
  const approveOperator = async (operatorId) => {
    const zone = selectedZone[operatorId];

    if (!zone) {
      toast.error("Select zone first");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/departments/approve-operator/${operatorId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(zone),
      },
    );

    const data = await res.json();

    if (!res.ok) return toast.error(data.message);

    toast.success("Operator approved");

    fetchOperators();
    fetchNotifications(); // 🔥 refresh notifications
  };

  /* ================= REJECT ================= */
  const rejectOperator = async (operatorId) => {
    const res = await fetch(
      `http://localhost:5000/api/departments/reject-operator/${operatorId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await res.json();

    if (!res.ok) return toast.error(data.message);

    toast.success("Operator rejected");

    fetchOperators();
    fetchNotifications(); // 🔥 refresh notifications
  };

  /* ================= MARK ALL READ ================= */
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => n.status === "Unread");

    if (unread.length === 0) {
      toast("No unread notifications");
      return;
    }

    try {
      await fetch(
        "http://localhost:5000/api/notification/department/read-all",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("All marked as read");
      fetchNotifications();
    } catch {
      toast.error("Failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted");
      fetchNotifications();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <DepartmentLayout>
        <div className="p-8 bg-gray-900 min-h-screen text-white">
          {/* ================= OPERATORS ================= */}
          <h2 className="text-2xl font-bold mb-6">Pending Operator Requests</h2>

          {operators.length === 0 ? (
            <p className="text-gray-400">No pending operators</p>
          ) : (
            <div className="overflow-x-auto mb-10">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-300">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Zone</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {operators.map((op, index) => (
                    <tr
                      key={op._id}
                      className="border-b border-gray-700 hover:bg-gray-800"
                    >
                      <td className="p-3 w-10">{index + 1}</td>

                      <td className="p-3 truncate max-w-[150px]">
                        {op.fullName}
                      </td>

                      <td className="p-3 text-gray-400 truncate max-w-[200px]">
                        {op.email}
                      </td>

                      <td className="p-3">
                        <select
                          className="bg-gray-700 px-2 py-1 rounded w-full"
                          onChange={(e) => {
                            const zone = zones.find(
                              (z) => z.zoneCode === e.target.value,
                            );
                            setSelectedZone({
                              ...selectedZone,
                              [op._id]: zone,
                            });
                          }}
                        >
                          <option>Select Zone</option>
                          {zones.map((z) => (
                            <option key={z.zoneCode} value={z.zoneCode}>
                              {z.zoneName}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3 flex gap-2 flex-wrap">
                        <button
                          onClick={() => approveOperator(op._id)}
                          className="bg-green-600 px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectOperator(op._id)}
                          className="bg-red-600 px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= NOTIFICATIONS ================= */}
          <div className="bg-gray-900 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Notifications</h2>

              <button
                onClick={markAllAsRead}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Mark All as Read
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="text-gray-400">No notifications</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-300">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {notifications.map((n) => (
                    <tr key={n.id} className="border-b border-gray-700">
                      <td className="p-3">{n.srNo}</td>
                      <td className="p-3">{n.title}</td>
                      <td className="p-3 text-gray-400">{n.message}</td>

                      <td className="p-3">
                        <span className="bg-green-600 px-2 py-1 rounded">
                          {n.type}
                        </span>
                      </td>

                      <td className="p-3">{n.status}</td>
                      <td className="p-3">{n.date}</td>

                      <td className="p-3">
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="bg-red-600 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </DepartmentLayout>
    </>
  );
};

export default OperatorRequests;
