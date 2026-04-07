import React, { useState, useEffect } from "react";
import axios from "axios";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
    MapPin,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Layers,
    Navigation,
    Activity,
    AlertCircle,
    Search,
    Settings
} from "lucide-react";
import toast from "react-hot-toast";

const ZoneConfiguration = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);

    const [formData, setFormData] = useState({
        zoneId: "",
        areaName: "",
        lat: "",
        lng: "",
        status: "active",
        priority: "medium"
    });

    const fetchZones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/all-zones`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setZones(res.data);
        } catch (err) {
            console.error("Failed to fetch zones", err);
            toast.error("Failed to load zones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            zoneId: "",
            areaName: "",
            lat: "",
            lng: "",
            status: "active",
            priority: "medium"
        });
        setEditingZone(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            if (editingZone) {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/departments/config-zones/${editingZone._id}`, formData, { headers });
                toast.success("Zone updated successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/departments/config-zones`, formData, { headers });
                toast.success("Zone created successfully");
            }

            fetchZones();
            resetForm();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (zone) => {
        setEditingZone(zone);
        setFormData({
            zoneId: zone.zoneId,
            areaName: zone.areaName,
            lat: zone.coordinates?.lat || "",
            lng: zone.coordinates?.lng || "",
            status: zone.status,
            priority: zone.priority
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this zone?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/departments/config-zones/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Zone deleted successfully");
            fetchZones();
        } catch (err) {
            toast.error("Failed to delete zone");
        }
    };

    return (
        <DepartmentLayout>
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">
                            Zone Configuration
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Architectural management of territorial sectors and operational status
                        </p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium transition hover:opacity-90 shadow-sm active:scale-95"
                    >
                        <Plus size={18} />
                        Initialize Sector
                    </button>
                </div>

                {/* STATS SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Total Sectors", value: zones.length, icon: MapPin, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Active Nodes", value: zones.filter(z => z.status === 'active').length, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Critical Focus", value: zones.filter(z => z.priority === 'high').length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-card border rounded-xl p-6 flex items-center gap-5 hover:shadow-md transition">
                            <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground tracking-widest leading-none mb-2">{stat.label}</p>
                                <p className="text-2xl font-bold leading-none">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* REGISTRY TABLE */}
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest flex items-center gap-2">
                            <Layers size={16} className="text-primary" />
                            Sectors Registry
                        </h3>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input disabled placeholder="Filter Registry..." className="bg-background border rounded-md pl-9 pr-4 py-1.5 text-xs focus:outline-none opacity-50 cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/10 border-b">
                                    <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Zone ID</th>
                                    <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Area Name</th>
                                    <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Location</th>
                                    <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider">Priority</th>
                                    <th className="p-5 text-xs font-semibold text-muted-foreground tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-16 text-center">
                                            <div className="inline-flex flex-col items-center gap-3">
                                                <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                <p className="text-xs font-medium text-muted-foreground">Reading Data Streams...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : zones.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-16 text-center text-sm font-medium text-muted-foreground opacity-50  ">
                                            No sectors detected in registry
                                        </td>
                                    </tr>
                                ) : (
                                    zones.map((zone) => (
                                        <tr key={zone._id} className="border-b last:border-0 hover:bg-muted/5 transition-colors group">
                                            <td className="p-5">
                                                <span className="bg-muted px-2.5 py-1 rounded-md text-[11px] font-bold text-foreground">
                                                    {zone.zoneId}
                                                </span>
                                            </td>
                                            <td className="p-5 font-semibold text-sm">{zone.areaName}</td>
                                            <td className="p-5 text-xs font-medium text-muted-foreground">
                                                {zone.coordinates?.lat.toFixed(4)}, {zone.coordinates?.lng.toFixed(4)}
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${zone.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        zone.status === 'monitoring' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {zone.status}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${zone.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                                        zone.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                    {zone.priority}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(zone)}
                                                        className="p-2.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-all"
                                                        title="Edit Configuration"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(zone._id)}
                                                        className="p-2.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-all"
                                                        title="Delete Sector"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL Overlay */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300">
                        <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border animate-in zoom-in-95 duration-300">
                            <div className="p-6 border-b flex justify-between items-center bg-muted/20">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Settings size={18} className="text-primary" />
                                        {editingZone ? "Modify Sector" : "New Deployment"}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Adjust territorial parameters</p>
                                </div>
                                <button onClick={resetForm} className="p-2 hover:bg-muted rounded-full transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Zone Identifier</label>
                                        <input
                                            required
                                            name="zoneId"
                                            value={formData.zoneId}
                                            onChange={handleInputChange}
                                            placeholder="Z-001"
                                            className="w-full bg-background border px-4 py-2.5 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Area Designation</label>
                                        <input
                                            required
                                            name="areaName"
                                            value={formData.areaName}
                                            onChange={handleInputChange}
                                            placeholder="Downtown District"
                                            className="w-full bg-background border px-4 py-2.5 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Latitude</label>
                                        <input
                                            required
                                            type="number"
                                            step="any"
                                            name="lat"
                                            value={formData.lat}
                                            onChange={handleInputChange}
                                            placeholder="0.0000"
                                            className="w-full bg-background border px-4 py-2.5 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Longitude</label>
                                        <input
                                            required
                                            type="number"
                                            step="any"
                                            name="lng"
                                            value={formData.lng}
                                            onChange={handleInputChange}
                                            placeholder="0.0000"
                                            className="w-full bg-background border px-4 py-2.5 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Status Level</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full bg-background border px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                                        >
                                            <option value="active">Active Monitoring</option>
                                            <option value="monitoring">Partial Scan</option>
                                            <option value="inactive">System Offline</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground ml-1">Priority Metric</label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full bg-background border px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                                        >
                                            <option value="low">Standard Priority</option>
                                            <option value="medium">Elevated Priority</option>
                                            <option value="high">Critical Directive</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm transition hover:opacity-90 shadow-md flex items-center justify-center gap-2 mt-4"
                                >
                                    <Save size={18} />
                                    {editingZone ? "Apply Configuration" : "Deploy Sector"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DepartmentLayout>
    );
};

export default ZoneConfiguration;


