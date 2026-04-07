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
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/accounts`, {
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
                        <h1 className="text-4xl font-black text-foreground">User Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage {counts.total} platform participants
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard 
                        title="Platform Trust Score" 
                        value={`${counts.avgCitizenTrust || 0}%`} 
                        subtitle="Global Reliability Average"
                    />
                    <StatCard
                        title="Active Citizens"
                        value={counts.citizens}
                        subtitle="Verified Public Accounts"
                    />
                    <StatCard
                        title="Operators in Field"
                        value={counts.operators}
                        subtitle="Department Staff Active"
                    />
                    <StatCard 
                        title="Security Intervention" 
                        value={counts.flagged || 0} 
                        subtitle="Total Accounts Flagged"
                        critical={(counts.flagged || 0) > 0}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className={`pb-3 text-sm border-b-2 transition-colors ${activeTab === tab.label
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
                                        <td colSpan="4" className="p-6 text-center text-muted-foreground  ">
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
                                                    className={`px-2 py-1 rounded text-xs font-bold ${statusColors[user.status] || "bg-muted text-muted-foreground"
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
                        <div className="w-80 bg-card border border-border rounded-xl p-6 space-y-6 transition-all animate-in slide-in-from-right-10 duration-500 shadow-sm">
                            
                            <div className="border-b border-border pb-4">
                                <h3 className="text-xl font-black text-foreground">{selectedUser.name}</h3>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${roleColors[selectedUser.role]}`}>
                                    {selectedUser.role} Account
                                </p>
                            </div>

                            {selectedUser.role === "Admin" ? (
                                <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col items-center text-center gap-4">
                                     <Minus size={32} className="text-primary opacity-40 rotate-90" />
                                     <div>
                                        <p className="text-[10px] font-black tracking-widest text-primary mb-2 uppercase">Metric Locked</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed leading-relaxed">
                                            This is a Department Admin account. Reliability scores for administrative nodes are fixed at 80% and cannot be manually adjusted.
                                        </p>
                                     </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Adjust Reliability</p>
                                            <span className="text-3xl font-black text-primary">{trustScore}%</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setTrustScore(Math.max(0, trustScore - 5))} className="p-2 hover:bg-muted rounded-xl transition-colors text-foreground border border-border bg-card shadow-sm active:scale-95">
                                                <Minus size={14} />
                                            </button>

                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                value={trustScore} 
                                                onChange={(e) => setTrustScore(parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" 
                                            />

                                            <button onClick={() => setTrustScore(Math.min(100, trustScore + 5))} className="p-2 hover:bg-muted rounded-xl transition-colors text-foreground border border-border bg-card shadow-sm active:scale-95">
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Calibration Reason</p>
                                        <textarea
                                            value={adjustReason}
                                            onChange={(e) => setAdjustReason(e.target.value)}
                                            placeholder="Specify justification for reliability calibration..."
                                            className="w-full bg-muted/30 border border-border rounded-xl p-4 text-xs text-foreground focus:ring-1 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/40 resize-none h-28"
                                        />
                                    </div>

                                    <button
                                        onClick={async () => {
                                            if (!adjustReason.trim()) {
                                                return toast.error("Please provide an adjustment reason");
                                            }

                                            try {
                                                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/update-trust/${selectedUser._id}`, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({
                                                        trustScore,
                                                        reason: adjustReason
                                                    })
                                                });

                                                const data = await res.json();
                                                if (res.ok) {
                                                    toast.success(data.message);
                                                    setAdjustReason("");
                                                    fetchUsers(); // Refresh list
                                                } else {
                                                    toast.error(data.message || "Failed to update trust");
                                                }
                                            } catch (err) {
                                                toast.error("Transmission error");
                                            }
                                        }}
                                        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black tracking-widest text-[10px] hover:bg-primary/90 transition-all active:scale-95 shadow-xl shadow-primary/20 uppercase"
                                    >
                                        Transmit Adjustment
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, subtitle, critical = false }) {
    return (
        <div className={`bg-card border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${critical ? "border-red-500/30" : "border-border shadow-inner"}`}>
            <div className="flex justify-between items-start mb-3">
                <p className={`text-[10px] font-black tracking-widest ${critical ? "text-red-500" : "text-muted-foreground opacity-60"}`}>
                    {title}
                </p>
                {critical && (
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
            </div>
            <h2 className={`text-3xl font-black ${critical ? "text-red-500" : "text-foreground"}`}>
                {value}
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground mt-1 opacity-50 tracking-wide">
                {subtitle}
            </p>
        </div>
    );
}


