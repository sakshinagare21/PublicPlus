import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import AdminLayout from "../../layout/AdminLayout";
import { Bell, Trash2, CheckCircle, AlertTriangle, Building2, User } from "lucide-react";

const socket = io(import.meta.env.VITE_API_BASE_URL);

const AdminDepartmentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const token = localStorage.getItem("token");

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/department-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (error) {
      console.error("Dept Fetch Error:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notification/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Admin Notifications Received:", res.data);
      setNotifications(res.data);
    } catch (error) {
      console.error("Notifications Fetch Error:", error.response?.data || error.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const approveDepartment = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/approve-department/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      toast.success(data.message);
      fetchDepartments();
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const rejectDepartment = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/reject-department/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      toast.error(data.message);
      fetchDepartments();
    } catch (error) {
      toast.error("Reject failed");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notification/admin/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchNotifications();

    socket.on("new-department-request", (data) => {
      toast("New Department Request: " + data.departmentName);
      fetchDepartments();
      fetchNotifications();
    });

    return () => {
      socket.off("new-department-request");
    };
  }, []);

  const categories = [...new Set(notifications.map(n => n.taskType).filter(Boolean))];

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = filterType === "all" ||
      (filterType === "department" && n.type.includes("department")) ||
      (filterType === "issue" && (n.type.includes("issue") || n.type.includes("verification"))) ||
      (filterType === "task" && n.type.includes("task"));

    const matchesCategory = filterCategory === "all" || n.taskType === filterCategory;

    return matchesType && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Department Approval Section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="text-blue-500" />
              Department Approval Requests
            </h2>
          </div>
          <div className="p-6">
            {departments.length === 0 ? (
              <p className="text-muted-foreground   text-center py-8">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept._id} className="p-4 rounded-xl border border-border bg-card/50 flex justify-between items-center hover:shadow-md transition">
                    <div>
                      <p className="font-semibold text-lg">{dept.departmentName}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span><strong className="text-foreground">Code:</strong> {dept.departmentCode}</span>
                        <span><strong className="text-foreground">Email:</strong> {dept.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveDepartment(dept._id)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                        Approve
                      </button>
                      <button onClick={() => rejectDepartment(dept._id)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Notifications Section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Bell className="text-blue-500" />
              System Alerts & Notifications
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
              >
                <option value="task">Escalated Tasks</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
              >
                <option value="all">Every Sector</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                onClick={markAllAsRead}
                className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition"
              >
                Mark All Read
              </button>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            {notifications.length === 0 ? (
              <div className="text-center text-muted-foreground py-20 bg-card/30 rounded-xl">
                <Bell size={48} className="mx-auto mb-4 opacity-10" />
                <p>No system notifications</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground font-bold bg-muted/20">
                    <th className="p-4 rounded-tl-xl w-16">#</th>
                    <th className="p-4">Alert Details</th>
                    <th className="p-4">Context (Dept/Operator)</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 rounded-tr-xl text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((n) => (
                    <tr key={n.id} className={`border-b border-border hover:bg-muted/10 transition-colors ${n.status === "Unread" ? "bg-blue-500/5" : ""} ${n.type === "task_escalated" ? "bg-red-500/5 animate-pulse-slow" : ""}`}>
                      <td className="p-4 text-muted-foreground">{n.srNo}</td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-2">
                          {n.status === "Unread" && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                          <span className={`font-bold ${n.type === "task_escalated" ? "text-red-500" : "text-foreground"}`}>{n.title}</span>
                          {n.type === "task_escalated" && (
                            <div className="px-2 py-0.5 bg-red-500 text-white rounded-md text-[8px] font-black tracking-widest flex items-center gap-1 shadow-sm">
                              <AlertTriangle size={8} /> Urgent
                            </div>
                          )}
                        </div>
                        <p className={`text-sm   leading-relaxed ${n.type === "task_escalated" ? "text-red-400 font-medium" : "text-muted-foreground"}`}>{n.message}</p>
                        {n.issueId && (
                          <Link
                            to={`/admin-issues?issueId=${n.issueId}`}
                            className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full inline-block mt-1 tracking-tighter hover:bg-blue-500 hover:text-white transition-all cursor-pointer font-bold"
                          >
                            Tactical Ref: #{n.issueId?.slice(-6)}
                          </Link>
                        )}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-foreground">
                            <Building2 size={14} className="text-blue-500" />
                            {n.department || "General"}
                          </div>
                          {n.operator && n.operator !== "N/A" && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User size={14} />
                              {n.operator}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full tracking-wider ${n.type === "task_escalated" ? "bg-red-600 text-white" :
                          n.type.includes("rejected") || n.type.includes("failed") || n.type.includes("reopened") ? "bg-red-600/10 text-red-500" :
                            n.type.includes("approved") || n.type.includes("resolved") ? "bg-green-600/10 text-green-500" :
                              "bg-blue-600/10 text-blue-500"
                          }`}>
                          {n.type.replace(/_/g, " ")}
                        </span>
                        <div className="mt-1 text-[9px] font-bold text-muted-foreground opacity-60">
                          {n.taskType}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground font-medium">
                        {n.date}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin-issues?issueId=${n.issueId}`}
                            className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition"
                            title="Deep Inspect"
                          >
                            <Bell size={16} />
                          </Link>
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                            title="Delete Alert"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDepartmentNotification;


