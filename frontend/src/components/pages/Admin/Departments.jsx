import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Plus,
    Download,
    Search,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";

export default function Departments() {

    const [activeTab, setActiveTab] = useState("Department List");
    const [searchQuery, setSearchQuery] = useState("");

    const [departments, setDepartments] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [zones, setZones] = useState([]);

    const [stats, setStats] = useState({
        totalDepartments: 0,
        activeOperators: 0,
        avgResolutionTime: 0
    });

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    /* ================= FETCH ================= */

    const fetchDepartments = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.success) {
                setDepartments(data.departments || []);
                setStats(prev => ({
                    ...prev,
                    totalDepartments: data.count
                }));
            }

        } catch {
            toast.error("Failed to load departments");
        }
    };

    const fetchOperators = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/operators`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.success) {
                setTeamMembers(data.operators || []);
                setStats(prev => ({
                    ...prev,
                    activeOperators: data.count
                }));
            }

        } catch {
            toast.error("Failed to load operators");
        }
    };

    const fetchZones = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/zones`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.success) {
                setZones(data.zones || []);
            }

        } catch {
            toast.error("Failed to load zones");
        }
    };

    useEffect(() => {
        setLoading(true);

        Promise.all([
            fetchDepartments(),
            fetchOperators(),
            fetchZones()
        ]).finally(() => setLoading(false));

    }, []);

    /* ================= FILTER ================= */

    const filteredDepartments = departments.filter((dept) =>
        dept.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6 text-foreground transition-colors duration-300">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Department Management</h1>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 transition-colors">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search departments..."
                                className="bg-transparent outline-none text-sm w-40 text-foreground placeholder:text-muted-foreground/50"
                            />
                        </div>

                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-4">

                    <div className="bg-card border border-border rounded-xl p-5 text-center transition-colors">
                        <p className="text-sm text-muted-foreground">Total Departments</p>
                        <p className="text-2xl font-bold text-foreground">{stats.totalDepartments}</p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5 text-center transition-colors">
                        <p className="text-sm text-muted-foreground">Avg Resolution</p>
                        <p className="text-2xl font-bold text-foreground">{stats.avgResolutionTime} min</p>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5 text-center transition-colors">
                        <p className="text-sm text-muted-foreground">Active Operators</p>
                        <p className="text-2xl font-bold text-foreground">{stats.activeOperators}</p>
                    </div>

                </div>

                {/* TABLE WITH TABS */}
                <div className="bg-card border border-border rounded-xl overflow-hidden transition-colors shadow-sm">

                    {/* MODERN TABS */}
                    <div className="flex gap-2 p-4 bg-muted/30 border-b border-border transition-colors">

                        {["Department List", "Zone Mapping", "Team Members"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${activeTab === tab
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}

                    </div>

                    {/* CONTENT */}
                    <div className="p-4">

                        {loading ? (
                            <p className="text-center text-muted-foreground py-10  ">Loading...</p>
                        ) : activeTab === "Department List" ? (

                            <table className="w-full text-sm text-center border-separate border-spacing-y-2">

                                <thead>
                                    <tr className="text-xs text-muted-foreground transition-colors">
                                        <th className="p-3">Department</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">City</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredDepartments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-muted-foreground  ">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-lg">📭</p>
                                                    <p>No departments available</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDepartments.map((dept) => (
                                            <tr key={dept._id} className="bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg text-foreground">

                                                <td className="p-3">
                                                    <p className="font-semibold">{dept.departmentName}</p>
                                                    <p className="text-xs text-muted-foreground">{dept.departmentCode}</p>
                                                </td>

                                                <td className="p-3">{dept.email}</td>

                                                <td className="p-3">{dept.city}</td>


                                                <td className="p-3">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                                                        {dept.accountStatus}
                                                    </span>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>

                        ) : activeTab === "Team Members" ? (

                            <table className="w-full text-sm text-center border-separate border-spacing-y-2">

                                <thead>
                                    <tr className="text-xs text-muted-foreground transition-colors">
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Department</th>
                                        <th className="p-3">Zone</th>
                                        <th className="p-3">Tasks</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {teamMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-muted-foreground  ">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-lg">📭</p>
                                                    <p>No operators available</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        teamMembers.map((op) => (
                                            <tr key={op._id} className="bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg text-foreground">

                                                <td className="p-3 font-semibold">{op.fullName}</td>

                                                <td className="p-3">
                                                    {op.departmentId?.departmentName || "N/A"}
                                                </td>

                                                <td className="p-3">
                                                    {op.assignedZone?.zoneName || "N/A"}
                                                </td>

                                                <td className="p-3">
                                                    {op.currentActiveTasks}/{op.maxCapacity}
                                                </td>

                                                <td className="p-3">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-success/20 text-success">
                                                        {op.status}
                                                    </span>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>

                        ) : (

                            <table className="w-full text-sm text-center border-separate border-spacing-y-2">

                                <thead>
                                    <tr className="text-xs text-muted-foreground transition-colors">
                                        <th className="p-3">Zone Name</th>
                                        <th className="p-3">Zone Code</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {zones.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="py-12 text-muted-foreground  ">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-lg">📭</p>
                                                    <p>No zones available</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        zones.map((zone, i) => (
                                            <tr key={i} className="bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg text-foreground">
                                                <td className="p-3 font-semibold">{zone.zoneName}</td>
                                                <td className="p-3 font-mono">{zone.zoneCode}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>

                        )}

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}


