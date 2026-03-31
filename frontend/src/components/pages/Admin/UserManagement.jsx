import { useState, useEffect } from "react";
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

const statusColors = {
 ACTIVE: "bg-green-500/20 text-green-400",
 FLAGGED: "bg-yellow-500/20 text-yellow-400",
 SUSPENDED: "bg-red-500/20 text-red-400",
};

const roleColors = {
 Citizen: "text-blue-400",
 Operator: "text-green-400",
 Admin: "text-purple-400",
};

export default function UserManagement() {

 const [users, setUsers] = useState([]);
 const [counts, setCounts] = useState({
 citizens: 0,
 operators: 0,
 admins: 0,
 total: 0
 });

 const [selectedUser, setSelectedUser] = useState(null);
 const [activeTab, setActiveTab] = useState("Citizen Accounts");
 const [trustScore, setTrustScore] = useState(0);
 const [adjustReason, setAdjustReason] = useState("");
 const [searchQuery, setSearchQuery] = useState("");

 const token = localStorage.getItem("token");

 /* ================= FETCH ================= */

 const fetchUsers = async () => {
 try {
 const res = await fetch("http://127.0.0.1:5000/api/admin/accounts", {
 headers: {
 Authorization: `Bearer ${token}`
 }
 });

 const data = await res.json();

 if (data.success) {
 setUsers(data.users);
 setCounts(data.counts);

 if (data.users.length > 0) {
 setSelectedUser(data.users[0]);
 setTrustScore(data.users[0].trust);
 }
 }

 } catch (err) {
 toast.error("Failed to load users");
 }
 };

 useEffect(() => {
 fetchUsers();
 }, []);

 /* ================= FILTER ================= */

 const filteredUsers = users
 .filter((u) =>
 activeTab === "Citizen Accounts"
 ? u.role === "Citizen"
 : activeTab === "Operator Accounts"
 ? u.role === "Operator"
 : u.role === "Admin"
 )
 .filter((u) =>
 u.name?.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const tabs = [
 { label: "Citizen Accounts", count: counts.citizens },
 { label: "Operator Accounts", count: counts.operators },
 { label: "Admin Accounts", count: counts.admins },
 ];

 return (
 <AdminLayout>
 <div className="space-y-6 text-foreground transition-colors duration-300">

 {/* Header */}
 <div className="flex justify-between">
 <div>
 <h1 className="text-2xl font-bold text-foreground">User Management</h1>
 <p className="text-sm text-muted-foreground">
 Manage {counts.total} platform participants
 </p>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => toast("Exporting users...")}
 className="flex gap-2 bg-card border border-border px-4 py-2 rounded-lg hover:border-primary text-foreground transition-colors"
 >
 <Download className="w-4 h-4" /> Export
 </button>

 <button
 onClick={() => toast.success("Add user form opened")}
 className="flex gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
 >
 <UserPlus className="w-4 h-4" /> Add User
 </button>
 </div>
 </div>

 {/* Tabs */}
 <div className="flex gap-6 border-b border-border">
 {tabs.map((tab) => (
 <button
 key={tab.label}
 onClick={() => setActiveTab(tab.label)}
 className={`pb-3 text-sm border-b-2 transition-colors ${
 activeTab === tab.label
 ? "border-primary text-primary"
 : "border-transparent text-muted-foreground hover:text-foreground"
 }`}
 >
 {tab.label} ({tab.count})
 </button>
 ))}
 </div>

 {/* Search */}
 <div className="flex gap-3">
 <div className="flex-1 flex gap-2 bg-card border border-border rounded-lg px-3 py-2 transition-colors">
 <Search className="w-4 h-4 text-muted-foreground" />
 <input
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Search users..."
 className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground/50"
 />
 </div>

 <button className="p-2 bg-card border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
 <Filter className="w-4 h-4" />
 </button>
 </div>

 <div className="flex gap-4">

 {/* TABLE */}
 <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden transition-colors shadow-sm">

 <table className="w-full text-sm">
 <thead className="border-b border-border text-muted-foreground bg-muted/30">
 <tr>
 <th className="p-4 text-left">IDENTITY</th>
 <th className="p-4 text-left">ROLE</th>
 <th className="p-4 text-left">TRUST</th>
 <th className="p-4 text-left">STATUS</th>
 </tr>
 </thead>

 <tbody>
 {filteredUsers.length === 0 ? (
 <tr>
 <td colSpan="4" className="p-6 text-center text-muted-foreground italic">
 No users found
 </td>
 </tr>
 ) : (
 filteredUsers.map((user) => (
 <tr
 key={user._id}
 onClick={() => {
 setSelectedUser(user);
 setTrustScore(user.trust);
 }}
 className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer text-foreground"
 >
 <td className="p-4">{user.name}</td>

 <td className={`p-4 ${roleColors[user.role]}`}>
 {user.role}
 </td>

 <td className="p-4 font-bold">{user.trust}</td>

 <td className="p-4">
 <span
 className={`px-2 py-1 rounded text-xs font-bold ${
 statusColors[user.status] || "bg-muted text-muted-foreground"
 }`}
 >
 {user.status}
 </span>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>

 {/* Pagination */}
 <div className="flex justify-between px-4 py-3 border-t border-border bg-muted/10">
 <span className="text-sm text-muted-foreground">
 Showing {filteredUsers.length} users
 </span>

 <div className="flex gap-2">
 <ChevronLeft className="cursor-pointer" />
 <ChevronRight className="cursor-pointer" />
 </div>
 </div>
 </div>

 {/* SIDE PANEL */}
 {selectedUser && (
 <div className="w-80 bg-card border border-border rounded-xl p-5 space-y-4 transition-colors shadow-sm">

 <h3 className="text-lg font-bold text-foreground">{selectedUser.name}</h3>

 <div className="flex items-center gap-2">
 <button onClick={() => setTrustScore(Math.max(0, trustScore - 5))} className="p-1 hover:bg-muted rounded transition-colors text-foreground">
 <Minus />
 </button>

 <span className="font-bold text-foreground">{trustScore}%</span>

 <button onClick={() => setTrustScore(Math.min(100, trustScore + 5))} className="p-1 hover:bg-muted rounded transition-colors text-foreground">
 <Plus />
 </button>
 </div>

 <textarea
 value={adjustReason}
 onChange={(e) => setAdjustReason(e.target.value)}
 placeholder="Adjustment reason..."
 className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50"
 />

 <button
 onClick={() => {
 toast.success(`Trust updated to ${trustScore}%`);
 setAdjustReason("");
 }}
 className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
 >
 Update Trust
 </button>

 </div>
 )}
 </div>
 </div>
 </AdminLayout>
 );
}

