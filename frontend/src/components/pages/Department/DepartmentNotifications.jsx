import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Bell, User, CheckCircle, AlertTriangle, Clock, Info, Eye } from "lucide-react";
import DepartmentLayout from "../../layout/DepartmentLayout";

const DepartmentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notification/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put("http://localhost:5000/api/notification/department/read-all", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("All marked as read");
      fetchNotifications();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getTypeStyle = (type) => {
    switch (type) {
      case "issue_created": return "border-blue-500 bg-blue-500/5 text-blue-400";
      case "issue_resolved": return "border-green-500 bg-green-500/5 text-green-400";
      case "issue_reopened": return "border-red-500 bg-red-500/5 text-red-400";
      case "task_escalated": return "border-orange-500 bg-orange-500/5 text-orange-400 font-bold";
      default: return "border-gray-500 bg-gray-500/5 text-gray-400";
    }
  };

  return (
    <DepartmentLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="text-blue-500" />
              Department Alerts
            </h1>
            <p className="text-muted-foreground mt-1">Real-time updates on operator tasks and issue status</p>
          </div>
          <button
            onClick={markAllRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-500/20"
          >
            Mark All as Read
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 italic text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-20 text-center shadow-sm">
            <Info size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground font-medium">Clear record! No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`group relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${n.status === "Unread"
                  ? "bg-card border-blue-500/30 shadow-xl shadow-blue-500/5"
                  : "bg-card/40 border-border opacity-80"
                  }`}
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${getTypeStyle(n.type)}`}>
                        {n.title}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {n.date}
                      </span>
                    </div>

                    <p className="text-foreground leading-relaxed font-medium mb-3">
                      {n.message}
                    </p>

                    {/* 🔥 ESCALATION PROOF PREVIEW */}
                    {n.type === "task_escalated" && n.escalation && (
                      <div className="mb-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-3">
                        <p className="text-xs text-orange-400 font-bold tracking-widest">Escalation Detail</p>
                        <p className="text-sm text-gray-300 italic">"{n.escalation.reason}"</p>
                        {n.escalation.proof && (
                          <div className="w-full max-w-[200px] rounded-lg overflow-hidden border border-border bg-black">
                            <img
                              src={`http://localhost:5000${n.escalation.proof}`}
                              alt="Proof"
                              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm mt-4 border-t border-border/50 pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User size={14} className="text-blue-500" />
                        <span className="font-semibold text-foreground">Operator:</span> {n.operator || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle size={14} className="text-orange-500" />
                        <span className="font-semibold text-foreground">Issue:</span>
                        <Link
                          to={`/department/issues?issueId=${n.issueId}`}
                          className="text-orange-500 hover:text-orange-400 font-black underline underline-offset-4 decoration-orange-500/30"
                        >
                          #{n.issueId?.slice(-6)}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                    {n.type === "task_escalated" && n.issueStatus === "escalated" && (
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={async () => {
                            try {
                              await axios.put(`http://localhost:5000/api/issues/${n.issueId}/status`,
                                { status: "closed", remark: "Escalation approved from notification center." },
                                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                              );
                              toast.success("Task Closed (Approved)");
                              fetchNotifications();
                            } catch (err) { toast.error("Action Failed"); }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition shadow-lg shadow-emerald-500/10"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await axios.put(`http://localhost:5000/api/issues/${n.issueId}/status`,
                                { status: "in_progress", remark: "Escalation rejected from notification center." },
                                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                              );
                              toast.success("Task Reopened (Rejected)");
                              fetchNotifications();
                            } catch (err) { toast.error("Action Failed"); }
                          }}
                          className="bg-white hover:bg-gray-100 text-black px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest border border-border shadow-sm transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <Link
                      to={`/department/issues?issueId=${n.issueId}`}
                      className="p-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all flex justify-center shadow-lg shadow-blue-500/5 active:scale-90"
                      title="View Tactical Brief"
                    >
                      <Eye size={20} />
                    </Link>
                  </div>
                </div>

                {n.status === "Unread" && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DepartmentLayout>
  );
};

export default DepartmentNotifications;

