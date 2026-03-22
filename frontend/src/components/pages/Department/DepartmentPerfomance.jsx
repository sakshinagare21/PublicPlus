import DepartmentLayout from "../../layout/DepartmentLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const monthlyData = [
  { month: "Jan", value: 3200 },
  { month: "Feb", value: 4100 },
  { month: "Mar", value: 3700 },
  { month: "Apr", value: 5200 },
  { month: "May", value: 4800 },
  { month: "Jun", value: 4500 },
];

const categoryData = [
  { name: "Roads", hours: 2.1 },
  { name: "Sanitation", hours: 3.8 },
  { name: "Parks", hours: 4.1 },
  { name: "Utility", hours: 5.5 },
  { name: "Permits", hours: 6.2 },
];

const DepartmentPerformance = () => {
  return (
    <DepartmentLayout>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Department Performance
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time analytics for municipal service management
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg">
            Export Report
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              AVG RESOLUTION TIME
            </p>
            <h2 className="text-2xl font-bold">
              4.2 hrs
            </h2>
            <p className="text-red-400 text-sm">
              -12% vs last week
            </p>
          </div>

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              SLA COMPLIANCE
            </p>
            <h2 className="text-2xl font-bold text-green-400">
              94.8%
            </h2>
            <p className="text-green-400 text-sm">
              +2.4% improvement
            </p>
          </div>

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              REOPEN RATE
            </p>
            <h2 className="text-2xl font-bold">
              2.1%
            </h2>
            <p className="text-red-400 text-sm">
              -0.5% change
            </p>
          </div>

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              TOTAL RESOLVED
            </p>
            <h2 className="text-2xl font-bold">
              1,284
            </h2>
            <p className="text-green-400 text-sm">
              +8% peak productivity
            </p>
          </div>

        </div>

        {/* MAIN ANALYTICS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LINE CHART */}
          <div className="lg:col-span-2 bg-[#111c2e] border border-gray-800 rounded-xl p-6 h-[350px]">
            <h3 className="mb-4 font-semibold">
              Monthly Resolution Trends
            </h3>

            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* SLA CIRCLE */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="mb-4 font-semibold">
              SLA Compliance %
            </h3>

            <div className="w-40 h-40">
              <CircularProgressbar
                value={94.8}
                text={`94.8%`}
                styles={buildStyles({
                  pathColor: "#3b82f6",
                  textColor: "#fff",
                  trailColor: "#1f2937",
                })}
              />
            </div>

            <p className="text-gray-400 text-sm mt-4">
              Target Range: 90% - 100%
            </p>
          </div>

        </div>

        {/* CATEGORY BAR CHART */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 h-[350px]">
          <h3 className="mb-4 font-semibold">
            Resolution Time by Category
          </h3>

          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={categoryData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="hours" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              Peak Performance Hour
            </p>
            <h2 className="text-xl font-bold">
              10:00 AM – 11:30 AM
            </h2>
          </div>

          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">
              Leading Team
            </p>
            <h2 className="text-xl font-bold">
              Urban Maintenance B
            </h2>
          </div>

        </div>

      </div>
    </DepartmentLayout>
  );
};

export default DepartmentPerformance;