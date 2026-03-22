import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import AdminLayout from "../../layout/AdminLayout";
const socket = io("http://localhost:5000");

const AdminDepartmentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= FETCH PENDING DEPARTMENTS ================= */

  const fetchDepartments = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/department-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setDepartments(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notification/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  /*================delete notification=================*/
  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notification/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      toast.error("Delete failed");
    }
  };
  /* ================= APPROVE ================= */

  const approveDepartment = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/approve-department/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      toast.success(data.message);

      fetchDepartments();
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  /* ================= REJECT ================= */

  const rejectDepartment = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/reject-department/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      toast.error(data.message);

      fetchDepartments();
    } catch (error) {
      toast.error("Reject failed");
    }
  };

  /*===================MARK NOTIFICATION AS READ====================*/
  const markAllAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notification/admin/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("All notifications marked as read");

      fetchNotifications(); // refresh table
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };
  /* ================= SOCKET EVENTS ================= */

  useEffect(() => {
    fetchDepartments();
    fetchNotifications();

    socket.on("new-department-request", (data) => {
      toast("New Department Request: " + data.departmentName);
      fetchDepartments();
      fetchNotifications();
    });

    socket.on("department-approved", (data) => {
      toast.success(data.departmentName + " approved");
      fetchNotifications();
    });

    socket.on("department-rejected", (data) => {
      toast.error(data.departmentName + " rejected");
      fetchNotifications();
    });

    return () => {
      socket.off("new-department-request");
      socket.off("department-approved");
      socket.off("department-rejected");
    };
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">
            Department Approval Requests
          </h2>

          {departments.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            <div className="space-y-4">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{dept.departmentName}</p>

                    <p className="text-sm text-gray-500">
                      Code: {dept.departmentCode}
                    </p>

                    <p className="text-sm text-gray-500">Email: {dept.email}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => approveDepartment(dept._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectDepartment(dept._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-8 mt-10 bg-gray-900 rounded-2xl shadow-xl text-white">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Notifications</h2>

            <button
              onClick={markAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
            >
              Mark All as Read
            </button>
          </div>

          {/* EMPTY */}
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No notifications 🚫
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                {/* HEADER */}
                <thead>
                  <tr className="bg-gray-800 text-gray-300 uppercase text-xs">
                    <th className="p-3">#</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {notifications.map((n) => (
                    <tr
                      key={n.id}
                      className={`border-b border-gray-700 hover:bg-gray-800 transition ${
                        n.status === "Unread" ? "bg-gray-800" : ""
                      }`}
                    >
                      <td className="p-3 text-gray-300">{n.srNo}</td>

                      <td className="p-3 font-semibold text-white">
                        {n.title}
                      </td>

                      <td className="p-3 text-gray-400">{n.message}</td>

                      {/* TYPE */}
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            n.type === "department_approved"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {n.type === "department_approved"
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            n.status === "Unread"
                              ? "bg-yellow-500 text-black"
                              : "bg-green-500 text-black"
                          }`}
                        >
                          {n.status}
                        </span>
                      </td>

                      <td className="p-3 text-gray-400">{n.date}</td>

                      {/* ACTION */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-lg text-xs shadow"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDepartmentNotification;
