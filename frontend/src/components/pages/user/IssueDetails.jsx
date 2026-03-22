import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layout/DashboardLayout";

import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Shield,
  AlertTriangle,
  Building2,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";

/* Button */
const Button = ({ children, className = "", variant, ...props }) => {
  const base =
    "rounded-lg px-4 py-2 text-sm font-medium transition flex items-center justify-center";

  const styles =
    variant === "outline"
      ? "border border-gray-300 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};

const IssueDetail = () => {
  const { issueId } = useParams();
  console.log("Issue ID from URL:", issueId); // Debug log
  const [issue, setIssue] = useState(null);
  const token = localStorage.getItem("token");

  /* ================= FETCH ISSUE ================= */
  const fetchIssue = async () => {
    try {
      
      const res = await axios.get(
        `http://localhost:5000/api/issues/${issueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIssue(res.data);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load issue");
    }
  };

  useEffect(() => {
    fetchIssue();
  }, []);
  console.log(issue); // Debug log
  if (!issue) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout>
      
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          to="/reports"
          className="flex items-center gap-2 text-sm text-gray-500"
        >
          <ArrowLeft size={16} />
          Back to Reports
        </Link>
      </div>

      {/* STATUS */}
      <div className="flex justify-end gap-2 mb-6">
        <span className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700">
          {issue.status}
        </span>

        <span className="px-3 py-1 text-xs rounded bg-red-100 text-red-600">
          {issue.priority?.level}
        </span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">

          {/* HERO */}
          <div className="bg-gray-200 rounded-xl p-6">
            <h1 className="text-xl font-bold">{issue.title}</h1>

            <p className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <MapPin size={14} />
              {issue.zone}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-600">
              {issue.description?.text}
            </p>
          </div>

          {/* ASSIGNMENT */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-2">Assignment</h2>

            <p className="text-sm">
              <b>Department:</b>{" "}
              {issue.assignedDepartment?.departmentName || "Not assigned"}
            </p>

            <p className="text-sm">
              <b>Operator:</b>{" "}
              {issue.assignedTo?.fullName || "Not assigned"}
            </p>
          </div>

          {/* ACTIVITY */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Activity</h2>

            <p className="text-sm text-gray-600">
              Reported by {issue.reportedBy?.fullName}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(issue.createdAt).toLocaleString()}
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">

          {/* LOCATION */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold mb-2">Location</h3>

            <p className="text-sm text-gray-600">
              Lat: {issue.location?.coordinates[1]}
            </p>

            <p className="text-sm text-gray-600">
              Lng: {issue.location?.coordinates[0]}
            </p>
          </div>

          {/* TIMELINE */}
          <div className="bg-white border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Timeline</h3>

            <p className="text-sm">
              📍 Reported: {new Date(issue.createdAt).toLocaleString()}
            </p>

            {issue.assignmentStatus === "assigned" && (
              <p className="text-sm">👨‍🔧 Assigned</p>
            )}

            {issue.status === "in_progress" && (
              <p className="text-sm">🚧 In Progress</p>
            )}

            {issue.status === "resolved" && (
              <p className="text-sm">✅ Resolved</p>
            )}
          </div>

          {/* ACTION */}
          <div className="bg-white border rounded-xl p-4 space-y-2">
            <Button className="w-full">
              <CheckCircle2 size={16} /> Verify Resolution
            </Button>

            <Button variant="outline" className="w-full">
              <AlertTriangle size={16} /> Reject Issue
            </Button>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default IssueDetail;