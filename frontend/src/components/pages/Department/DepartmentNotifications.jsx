import { useState } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
  AlertTriangle,
  BellRing,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const DepartmentNotifications = () => {
  const [activeTab, setActiveTab] = useState("All");

  const alerts = [
    {
      type: "SLA",
      title: "Pothole Repair Overdue",
      message:
        "SLA timer exceeded by 2 hours for Ticket #PH-982. Immediate intervention required.",
      time: "2 mins ago",
    },
    {
      type: "Escalation",
      title: "High Priority: Water Main Break",
      message:
        "Issue #WT-441 escalated to Critical by Field Supervisor.",
      time: "15 mins ago",
    },
    {
      type: "Feedback",
      title: "Positive Feedback: Street Lighting",
      message:
        "Citizen submitted compliment for quick resolution on Oak Street.",
      time: "1 hour ago",
    },
    {
      type: "Escalation",
      title: "Unresolved Noise Complaint",
      message:
        "Ticket escalated due to 3 consecutive reports within 24 hrs.",
      time: "3 hours ago",
    },
  ];

  const filteredAlerts =
    activeTab === "All"
      ? alerts
      : alerts.filter((a) =>
          a.type.toLowerCase().includes(activeTab.toLowerCase())
        );

  const getStyle = (type) => {
    switch (type) {
      case "SLA":
        return "border-red-500 bg-red-500/5";
      case "Escalation":
        return "border-orange-500 bg-orange-500/5";
      case "Feedback":
        return "border-blue-500 bg-blue-500/5";
      default:
        return "border-gray-700";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "SLA":
        return <BellRing size={18} className="text-red-400" />;
      case "Escalation":
        return <AlertTriangle size={18} className="text-orange-400" />;
      case "Feedback":
        return <MessageSquare size={18} className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <DepartmentLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Alerts & Notifications
            </h1>
            <p className="text-gray-400 text-sm">
              Manage and respond to real-time municipal service triggers
            </p>
          </div>

          <button className="bg-[#1e293b] hover:bg-[#273549] px-4 py-2 rounded-lg text-sm">
            Mark all as read
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-gray-800 pb-2 text-sm">
          {["All", "SLA", "Escalation", "Feedback"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                  : "text-gray-400"
              }`}
            >
              {tab === "All"
                ? "All Alerts"
                : tab === "SLA"
                ? "SLA Warnings"
                : tab === "Escalation"
                ? "Escalations"
                : "Citizen Feedback"}
            </button>
          ))}
        </div>

        {/* ALERT LIST */}
        <div className="space-y-4">

          {filteredAlerts.map((alert, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-xl p-6 bg-[#111c2e] border border-gray-800 flex justify-between items-start ${getStyle(
                alert.type
              )}`}
            >
              <div className="flex gap-4">

                <div className="mt-1">
                  {getIcon(alert.type)}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">
                    {alert.type.toUpperCase()} • {alert.time}
                  </p>

                  <h3 className="font-semibold">
                    {alert.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {alert.message}
                  </p>
                </div>

              </div>

              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
                Action
              </button>

            </div>
          ))}

        </div>

        {/* View Older */}
        <div className="text-center pt-6">
          <button className="text-blue-400 hover:underline text-sm">
            View older notifications
          </button>
        </div>

      </div>
    </DepartmentLayout>
  );
};

export default DepartmentNotifications;