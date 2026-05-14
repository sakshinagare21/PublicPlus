import DepartmentLayout from "../../layout/DepartmentLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, AlertTriangle, CheckCircle, Clock, Zap, Users, Shield, Plus, ArrowRight, Activity } from "lucide-react";
import toast from "react-hot-toast";

const Zones = () => {
    const [issues, setIssues] = useState([]);
    const [assignedZones, setAssignedZones] = useState([]);
    const [availableZones, setAvailableZones] = useState([]);
    const [operators, setOperators] = useState([]);
    const [zonesData, setZonesData] = useState({});
    const [selectedZone, setSelectedZone] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // 1. Fetch Department Info
                const deptRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/me`, { headers });
                const assigned = deptRes.data.assignedZones || [];
                setAssignedZones(assigned);

                // 2. Fetch All Available City Zones
                const availableRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/available-zones`, { headers });
                const cityZones = availableRes.data || [];
                setAvailableZones(cityZones);

                // 3. Fetch Operators
                const opsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/operators`, { headers });
                setOperators(opsRes.data || []);

                // 4. Fetch Issues for stats
                const issuesRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/issues/department/issue?page=1&limit=2000`,
                    { headers }
                );
                const fetchedIssues = issuesRes.data.issues || [];
                setIssues(fetchedIssues);

                // Aggregate by Zone
                const aggregated = {};
                cityZones.forEach(z => {
                    aggregated[z.areaName] = {
                        total: 0,
                        completed: 0,
                        active: 0,
                        pending: 0,
                        id: z._id,
                        code: z.zoneId
                    };
                });

                fetchedIssues.forEach((issue) => {
                    const z = issue.zone;
                    if (z && aggregated[z]) {
                        aggregated[z].total += 1;
                        if (["resolved", "closed"].includes(issue.status)) {
                            aggregated[z].completed += 1;
                        } else if (["in_progress", "reopened", "escalated"].includes(issue.status)) {
                            aggregated[z].active += 1;
                        } else {
                            aggregated[z].pending += 1;
                        }
                    }
                });

                setZonesData(aggregated);

                // Select the first assigned zone by default
                if (assigned.length > 0 && !selectedZone) {
                    setSelectedZone(assigned[0].zoneName);
                }
            } catch (err) {
                console.error("Failed to load zones data", err);
                toast.error("Data synchronization failed");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [refresh]);

    const handleAddZone = async (zoneName, zoneCode) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/departments/zones`,
                { zoneName, zoneCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRefresh(prev => prev + 1);
            toast.success(`${zoneName} jurisdiction established.`);
        } catch (err) {
            toast.error("Jurisdiction claim failed: " + (err.response?.data?.message || err.message));
        }
    };

    const activeZoneData = selectedZone ? zonesData[selectedZone] : null;
    const activeZoneOperators = operators.filter(op => op.assignedZone?.zoneName === selectedZone);
    const isAssigned = (zName) => assignedZones.some(z => z.zoneName === zName);

    return (
        <DepartmentLayout>
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">
                            Jurisdictional Zones
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage operational sectors and monitoring territories
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border">
                            <Shield size={16} className="text-primary" />
                            <span className="text-sm font-medium">{assignedZones.length} Sectors Active</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground font-medium">Loading...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* LEFT COLUMN: NAVIGATION & CATALOG */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* CURRENT PRECINCTS */}
                            <div className="bg-card border rounded-2xl p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-semibold text-muted-foreground tracking-widest">Department Zone</h3>
                                    <div className="h-0.5 flex-1 mx-6 bg-border/50" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {assignedZones.map((zone) => {
                                        const zName = zone.zoneName;
                                        const data = zonesData[zName] || { total: 0 };
                                        const isSelected = selectedZone === zName;
                                        return (
                                            <button
                                                key={zone.zoneCode}
                                                onClick={() => setSelectedZone(zName)}
                                                className={`relative p-6 rounded-xl border text-left transition-all group ${isSelected
                                                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 scale-[1.02]"
                                                    : "bg-background hover:border-primary/50 hover:shadow-md"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <MapPin size={20} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                                                    <span className="text-xs font-bold text-muted-foreground px-2 py-1 bg-muted rounded-md">{zone.zoneCode}</span>
                                                </div>
                                                <h4 className="text-xl font-semibold mb-2">{zName}</h4>
                                                <div className="flex items-center gap-2">
                                                    <Activity size={14} className="text-emerald-500" />
                                                    <span className="text-xs font-medium text-muted-foreground">{data.total} Active Zone</span>
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                                )}
                                            </button>
                                        );
                                    })}
                                    {assignedZones.length === 0 && (
                                        <div className="col-span-2 py-16 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                                            <MapPin size={32} className="mx-auto mb-4 text-muted-foreground/30" />
                                            <p className="text-sm font-medium text-muted-foreground">No operational zones initialized.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CITY-WIDE CATALOG */}
                            <div className="bg-card border rounded-2xl p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-sm font-semibold text-muted-foreground tracking-widest">Territory Catalog</h3>
                                    <div className="h-0.5 flex-1 mx-6 bg-border/50" />
                                    <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">Available</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {availableZones.filter(z => !isAssigned(z.areaName)).map((zone) => (
                                        <div
                                            key={zone.zoneId}
                                            className="p-5 bg-background border rounded-xl hover:border-primary/40 transition-all group relative overflow-hidden"
                                        >
                                            <div className="mb-4">
                                                <p className="text-[10px] font-black text-muted-foreground tracking-widest">{zone.zoneId}</p>
                                                <h5 className="font-semibold text-foreground text-sm">{zone.areaName}</h5>
                                            </div>
                                            <button
                                                onClick={() => handleAddZone(zone.areaName, zone.zoneId)}
                                                className="w-full flex justify-center items-center gap-2 py-2 text-xs font-semibold bg-muted hover:bg-primary hover:text-white rounded-lg transition-all"
                                            >
                                                <Plus size={14} />
                                                Claim Sector
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ANALYTICS & PERSONNEL */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* PRECINCT DYNAMICS */}
                            {activeZoneData && (
                                <div className="bg-card border rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{selectedZone}</h3>
                                            <p className="text-xs text-muted-foreground font-medium tracking-widest">Active Dynamics</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { label: "Total Load", value: activeZoneData.total, icon: MapPin, color: "text-blue-500", bg: "bg-blue-500/10" },
                                            { label: "Pending Disp", value: activeZoneData.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                                            { label: "Active Field", value: activeZoneData.active, icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
                                            { label: "Closed/Final", value: activeZoneData.completed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                        ].map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                                        <stat.icon size={16} />
                                                    </div>
                                                    <span className="text-xs font-semibold text-muted-foreground ">{stat.label}</span>
                                                </div>
                                                <span className="text-lg font-bold">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </div>
        </DepartmentLayout>
    );
};

export default Zones;


