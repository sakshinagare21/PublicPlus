import { useState } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
  FileText,
  BarChart3,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";

const DepartmentReports = () => {
  const [activeTab, setActiveTab] = useState("Weekly");
  const [format, setFormat] = useState("PDF");

  const reports = [
    {
      name: "Weekly_Service_Audit_Q3_W24",
      type: "Weekly Audit",
      date: "Oct 24, 2023 - 09:15 AM",
      status: "READY",
    },
    {
      name: "Performance_Review_September_2023",
      type: "Monthly Metrics",
      date: "Oct 01, 2023 - 02:30 PM",
      status: "READY",
    },
    {
      name: "Issue_Audit_Critical_Infrastructure",
      type: "Issue Audit",
      date: "Sep 28, 2023 - 11:05 AM",
      status: "ARCHIVED",
    },
  ];

  return (
    <DepartmentLayout>
      <div className="space-y-8">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-3xl font-bold">
            Reports & Archive
          </h1>
          <p className="text-gray-400 text-sm">
            Configure and generate municipal service reports or access historical data.
          </p>
        </div>

        {/* GENERATE REPORT CARD */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">

          <h3 className="font-semibold text-lg">
            Generate New Report
          </h3>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-800 pb-2 text-sm">
            {["Weekly", "Monthly", "Performance", "Audit"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "text-gray-400"
                }`}
              >
                {tab} Report
              </button>
            ))}
          </div>

          {/* Date Range + Output */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">
                SELECT DATE RANGE
              </label>

              <div className="flex gap-3">
                <input
                  type="date"
                  className="bg-[#0f172a] border border-gray-700 rounded-lg p-2 w-full"
                />
                <input
                  type="date"
                  className="bg-[#0f172a] border border-gray-700 rounded-lg p-2 w-full"
                />
              </div>
            </div>

            {/* Output Formats */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">
                OUTPUT FORMATS
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => setFormat("PDF")}
                  className={`px-4 py-2 rounded-lg border ${
                    format === "PDF"
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-700"
                  }`}
                >
                  PDF
                </button>

                <button
                  onClick={() => setFormat("CSV")}
                  className={`px-4 py-2 rounded-lg border ${
                    format === "CSV"
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-700"
                  }`}
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg">
                Generate & Export Report
              </button>
            </div>

          </div>

          <p className="text-gray-500 text-sm">
            Generating complex reports may take up to 2 minutes.
          </p>

        </div>

        {/* HISTORICAL ARCHIVE */}
        <div className="space-y-4">

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Historical Archive
            </h3>

            <div className="flex gap-3">
              <button className="border border-gray-700 px-4 py-2 rounded-lg text-sm">
                Filter
              </button>
              <button className="border border-gray-700 px-4 py-2 rounded-lg text-sm">
                Sort
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl overflow-hidden">

            <table className="w-full text-sm">

              <thead className="text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="text-left p-4">Report Name</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Generated Date</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800 hover:bg-[#162235]"
                  >
                    <td className="p-4">{report.name}</td>
                    <td>{report.type}</td>
                    <td>{report.date}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          report.status === "READY"
                            ? "bg-green-600/20 text-green-400"
                            : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="flex gap-4 items-center">
                      <Download
                        size={16}
                        className="cursor-pointer hover:text-blue-400"
                      />
                      <Trash2
                        size={16}
                        className="cursor-pointer hover:text-red-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>

      </div>
    </DepartmentLayout>
  );
};

export default DepartmentReports;