import { useState } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Download,
  UserPlus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

const users = [
  {
    name: "David Martinez",
    email: "dmartinez@civic.org",
    role: "Citizen",
    trust: 88,
    trustColor: "text-green-400",
    lastActivity: "12 mins ago",
    lastDetail: "Voted on Ref. #882",
    status: "ACTIVE",
  },
  {
    name: "Elena Rodriguez",
    email: "e.rodriguez@domain.com",
    role: "Citizen",
    trust: 64,
    trustColor: "text-blue-400",
    lastActivity: "2 hours ago",
    lastDetail: "Reported Infrastructure",
    status: "ACTIVE",
  },
  {
    name: "Liam Thompson",
    email: "thompson.l@city.gov",
    role: "Operator",
    trust: 42,
    trustColor: "text-yellow-400",
    lastActivity: "3 days ago",
    lastDetail: "System Login",
    status: "FLAGGED",
  },
  {
    name: "Sarah Kim",
    email: "sarah.k@provider.net",
    role: "Citizen",
    trust: 15,
    trustColor: "text-red-400",
    lastActivity: "1 week ago",
    lastDetail: "Appeal Rejected",
    status: "SUSPENDED",
  },
];

const activityLog = [
  {
    event: "Voted on Proposal #882",
    date: "Dec 20, 2023 • 14:22",
    detail: "IP: 192.168.1.4",
    color: "bg-blue-500",
  },
  {
    event: "Commented on Public Transit Reform",
    date: "Dec 18, 2023 • 09:15",
    detail: "IP: 192.168.1.4",
    color: "bg-gray-500",
  },
  {
    event: "Identity Re-verified",
    date: "Dec 15, 2023 • 11:40",
    detail: "System Process",
    color: "bg-green-500",
  },
];

const statusColors = {
  ACTIVE: "bg-green-500/20 text-green-400",
  FLAGGED: "bg-yellow-500/20 text-yellow-400",
  SUSPENDED: "bg-red-500/20 text-red-400",
};

const roleColors = {
  Citizen: "text-blue-400",
  Operator: "text-green-400",
};

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [activeTab, setActiveTab] = useState("Citizen Accounts");
  const [trustScore, setTrustScore] = useState(users[0].trust);
  const [adjustReason, setAdjustReason] = useState("");

  const tabs = [
    { label: "Citizen Accounts", count: "11.2k" },
    { label: "Operator Accounts", count: "842" },
    { label: "Admin Accounts", count: "46" },
  ];

  return (
    <AdminLayout>
    <div className="space-y-6 text-gray-200">

      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-400">
            Manage 12,482 platform participants
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => toast("Exporting users...")}
            className="flex gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg hover:border-blue-500"
          >
            <Download className="w-4 h-4" /> Export
          </button>

          <button
            onClick={() => toast.success("Add user form opened")}
            className="flex gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label);
              toast(tab.label);
            }}
            className={`pb-3 text-sm border-b-2 ${
              activeTab === tab.label
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 flex gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            placeholder="Search users..."
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>

        <button
          onClick={() => toast("Filters")}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-4">

        {/* Table */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <table className="w-full text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                <th className="p-4 text-left">IDENTITY</th>
                <th className="p-4 text-left">ROLE</th>
                <th className="p-4 text-left">TRUST</th>
                <th className="p-4 text-left">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.email}
                  onClick={() => {
                    setSelectedUser(user);
                    setTrustScore(user.trust);
                  }}
                  className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
                >
                  <td className="p-4">{user.name}</td>
                  <td className={`p-4 ${roleColors[user.role]}`}>
                    {user.role}
                  </td>
                  <td className={`p-4 font-bold ${user.trustColor}`}>
                    {user.trust}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusColors[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between px-4 py-3 border-t border-gray-800">
            <span className="text-sm text-gray-400">Page 1 of 3</span>

            <div className="flex gap-2">
              <ChevronLeft className="cursor-pointer" />
              <ChevronRight className="cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">

          <h3 className="text-lg font-bold">{selectedUser.name}</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setTrustScore(Math.max(0, trustScore - 5))
              }
              className="p-2 bg-gray-800 rounded"
            >
              <Minus />
            </button>

            <span className="font-bold">{trustScore}%</span>

            <button
              onClick={() =>
                setTrustScore(Math.min(100, trustScore + 5))
              }
              className="p-2 bg-gray-800 rounded"
            >
              <Plus />
            </button>
          </div>

          <textarea
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            placeholder="Adjustment reason..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
          />

          <button
            onClick={() => {
              toast.success(`Trust updated to ${trustScore}%`);
              setAdjustReason("");
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Update Trust
          </button>

          {/* Activity */}
          <div className="space-y-2">
            {activityLog.map((log, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${log.color}`} />
                {log.event}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}

